import { Request, Response } from 'express'
import prisma from '@/prisma';
import { hash, genSalt, compare } from "bcrypt";
import { sign } from 'jsonwebtoken'
import { uploader } from '@/helpers/uploader';
import fs from "fs"
import handlebars from "handlebars"
import path from "path";
import { transporter } from '@/helpers/nodemailer';
import { User } from '@prisma/client';


export class UserController {

    async userRegister(req: Request, res: Response) {
        try {
            const { username, email, password, referall } = req.body
            const salt = await genSalt(10)
            const hashPassword = await hash(password, salt)

            const validateEmail = await prisma.user.findUnique({
                where: {email: email}
            })
            const validateUser = await prisma.user.findUnique({
                where: {username: username}
            })

            if (validateEmail) throw 'This email has been taken by another user, please change your email'
            if (validateUser) throw 'This username has been taken by another user, please change your username'

            let createdUser

            if (referall !== undefined && referall !== null && referall !== '') {
                const reffUser = await prisma.referral.findUnique({
                    where: { referralCode: referall }
                })

                if (!reffUser) throw "Wrong referral code"
                createdUser = await prisma.user.create({
                    data: {
                        username: username, email: email, password: hashPassword
                    }
                })
            } else {
                createdUser = await prisma.user.create({
                    data: {
                        username: username, email: email, password: hashPassword
                    }
                })
            }


            const payload = {
                id: createdUser?.id,
                referall: referall || null
            }
            const token = sign(payload, process.env.KEY_JWT!, {})
            const link = `http://localhost:3000/verify/activate/${token}`
            const templatePath = path.join(__dirname, "../templates", "register.html")
            const templateSource = fs.readFileSync(templatePath, 'utf-8')
            const compiledTemplate = handlebars.compile(templateSource)
            const html = compiledTemplate({
                name: createdUser?.username,
                link
            })

            await transporter.sendMail({
                from: process.env.MAIL_USER!,
                to: createdUser?.email,
                subject: "Verify as User",
                html
            })

            res.status(200).json({
                user: createdUser,
                link: link
            })
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async userActivate(req: Request, res: Response) {
        try {
            const activateUser = await prisma.user.update({
                where: { id: req.user?.id },
                data: { isActive: true }
            })

            const referralCode = await generateReferralNumber();
            if (activateUser) {
                await prisma.referral.create({
                    data: {
                        referralCode,
                        userId: req.user?.id!
                    }
                });
            }

            if (req.user?.referall) {
                const reffUser = await prisma.referral.findUnique({
                    where: { referralCode: req.user?.referall }
                })

                if (!reffUser) throw "Wrong referral code"

                await prisma.points.create({
                    data: {
                        amount: 10000,
                        exprirationDate: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000),
                        userId: reffUser.userId
                    },
                })

                await prisma.discount.create({
                    data: {
                        discount: 10,
                        exprirationDate: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000),
                        userId: req.user?.id
                    }
                })
            }
            res.json(activateUser)
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async userLogin(req: Request, res: Response) {
        try {
            const { data, password } = req.body
            const users = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username: data },
                        { email: data }
                    ]
                }
            })

            if (users == null) throw "User not found!"
            if (users.isActive === false) throw "Not active"

            const isValidPass = await compare(password, users.password)
            if (isValidPass == false) throw "Wrong Password!"

            const payload = {
                id: users.id,
                isOrganizer: users.isOrganizer
            }
            const token = sign(payload, process.env.KEY_JWT!, {})

            res.status(200).json({
                status: 'ok',
                users,
                token,
            })
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async keepLogin(req: Request, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user?.id },
                select: {
                    id: true, username: true, isOrganizer: true
                }
            })
            res.status(200).json(user)
        } catch (error) {
            res.status(400).json({
                status: "error",
                message: error
            });
        }
    }

    async userProfile(req: Request, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user?.id
                },
                select: {
                    id: true,
                    username: true,
                    isOrganizer: true,
                    referral: true,
                    image: true,
                    email: true,
                    Point: true,
                    Discount: true,
                    Event: true,
                }
            })
            res.status(200).json(user)
        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: err
            })
        }
    }

    async userUpdate(req: Request, res: Response) {
        try {
            let newPath = null
            if (req.file) {
                const { originalname, path } = req.file
                const parts = originalname.split('.')
                const ext = parts[parts.length - 1]
                newPath = path + '.' + ext
                fs.renameSync(path, newPath)
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: req.user?.id
                }
            })
            let updateUser
            if (user?.email !== req.body.email) {
                updateUser = await prisma.user.update({
                    where: {
                        id: user?.id
                    },
                    data: {
                        username: req.body.username,
                        image: newPath ? newPath : user?.image
                    }
                })

                const payload = {
                    id: user?.id,
                    email: req.body.email
                }
                const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h' })
                const link = `http://localhost:3000/verify/update_email/${token}`
                const templatePath = path.join(__dirname, "../templates", "updateEmail.html")
                const templateSource = fs.readFileSync(templatePath, 'utf-8')
                const compiledTemplate = handlebars.compile(templateSource)
                const html = compiledTemplate({
                    name: user?.username,
                    link
                })

                await transporter.sendMail({
                    from: process.env.MAIL_USER!,
                    to: req.body.email,
                    subject: "Update email confirmation",
                    html
                })
                res.status(200).json({ status: "update email", email: req.body.email });
            } else if (user?.email === req.body.email) {
                updateUser = await prisma.user.update({
                    where: {
                        id: user?.id
                    },
                    data: {
                        ...req.body,
                        image: newPath ? newPath : user?.image
                    }
                })
                res.status(200).json({ status: "user updated" });
            }
        }
        catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    // user end here

    //organizer start here

    async sendEmail(req: Request, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user?.id }
            })

            const payload = {
                id: user?.id
            }
            const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h' })
            const link = `http://localhost:3000/verify/organizer/${token}`
            const templatePath = path.join(__dirname, "../templates", "verify.html")
            const templateSource = fs.readFileSync(templatePath, 'utf-8')
            const compiledTemplate = handlebars.compile(templateSource)
            const html = compiledTemplate({
                name: user?.username,
                link
            })

            await transporter.sendMail({
                from: process.env.MAIL_USER!,
                to: user?.email,
                subject: "Verify as An Organizer",
                html
            })
            res.status(200).json('email send')
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async verifyOrganizer(req: Request, res: Response) {
        try {
            await prisma.user.update({
                data: {
                    isOrganizer: true
                },
                where: {
                    id: req.user?.id
                }
            })
            res.status(200).json({
                status: 'ok',
                message: 'Verify Account Success'
            })
        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: err
            })
        }
    }

    async updateEmail(req: Request, res: Response) {
        try {
            const validate = await prisma.user.findUnique({
                where: { email: req.user?.email }
            })
            if (validate) throw 'Email has been used with another account'
            await prisma.user.update({
                data: {
                    email: req.user?.email
                },
                where: {
                    id: req.user?.id
                }
            })
            res.status(200).json({
                status: 'ok',
                message: 'Update Email Success'
            })
        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: err
            })
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { email: req.body.email }
            })
            if (!user) throw 'Account not found'
            const payload = {
                id: user?.id,
                email: user?.email
            }
            const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h' })
            const link = `http://localhost:3000/verify/forget_password/update/${token}`
            const templatePath = path.join(__dirname, "../templates", "resetPassword.html")
            const templateSource = fs.readFileSync(templatePath, 'utf-8')
            const compiledTemplate = handlebars.compile(templateSource)
            const html = compiledTemplate({
                name: user?.username,
                link
            })

            await transporter.sendMail({
                from: process.env.MAIL_USER!,
                to: req.body.email,
                subject: "Reset password confirmation",
                html
            })
            res.status(200).json({status: 'ok', message: 'email sended'})
        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: err
            })
        }
    }

    async updatePassword(req: Request, res: Response) {
        try {
            const {password, confirm} = req.body
            if (password !== confirm) throw 'Invalid confirmation'
            
            const salt = await genSalt(10)
            const hashPassword = await hash(password, salt)

            await prisma.user.update({
                data: {password: hashPassword},
                where: { email: req.user?.email }
            })

            res.status(200).json({status: 'ok', message: 'User updated'})
        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: err
            })
        }
    }
}

// Function to generate unique referral code
async function generateReferralNumber() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 8;
    let referralCode = '';

    // Generate referral code
    for (let i = 0; i < length; i++) {
        referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Check if referral code already exists in database
    const existingReferral = await prisma.referral.findUnique({
        where: {
            referralCode
        }
    });

    // If referral code already exists, recursively generate a new one until unique
    if (existingReferral) {
        return generateReferralNumber();
    }

    // If referral code is unique, return it
    return referralCode;
}
