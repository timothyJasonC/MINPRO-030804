import { useState } from "react";
import Image from "next/image";

type ProfilePhotoProps = {
    onFieldChange: (url: string) => void;
    image: string | undefined;
    setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function ProfilePhoto({ image, onFieldChange, setUploadedFile }: ProfilePhotoProps) {
    const [previewImage, setPreviewImage] = useState<string | undefined>(image);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const fileData = reader.result as string;
                setPreviewImage(fileData);
                onFieldChange(fileData);
            };
            reader.readAsDataURL(file);
        }
    }

    function removePhoto() {
        setPreviewImage(undefined);
        onFieldChange("");
    }

    return (
        <div className="mb-2">
            <label className="flex flex-col h-32 gap-1 w-32 mx-auto border rounded-full bg-transparent text-xl whitespace-nowrap text-gray-600">
                {previewImage ? (
                    <Image src={ previewImage} width={100} height={100} alt="Uploaded" className="w-32 h-32 object-cover rounded-full" />
                ) : (
                    <Image src={`http://localhost:8000/${image}` || "/images/user.png"} width={100} height={100} alt="" className="w-32 h-32 object-cover rounded-full" />
                )}
            </label>
            <div className="flex justify-between w-32 mx-auto mt-2">
                <label className="cursor-pointer border rounded-full p-2">
                    <input type="file" accept="image/*" onChange={handleFileChange} name="file" className="hidden" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                </label>
                {previewImage && (
                    <button className="cursor-pointer border rounded-full p-2" onClick={removePhoto}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
