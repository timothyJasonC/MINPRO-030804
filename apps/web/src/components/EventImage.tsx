import { useEffect, useState } from 'react'

type FileUploaderProps = {
    onFieldChange: (url: string) => void
    imageUrl: string
    setFiles: React.Dispatch<React.SetStateAction<File | null>>
}

export default function EventImage({ imageUrl, onFieldChange, setFiles }: FileUploaderProps) {
    const [previewImage, setPreviewImage] = useState<string | undefined>(imageUrl);

    useEffect(() => {
        setPreviewImage(imageUrl);
    }, [imageUrl]);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setFiles(file);
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
        setFiles(null)
    }
    return (
        <div>
            <div className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50">
                {imageUrl ? (
                    <div className="relative flex h-full w-full flex-1 justify-center ">
                        <img
                            src={previewImage}
                            alt="image"
                            width={250}
                            height={250}
                            className="w-full object-cover object-center"
                        />
                        <button onClick={removePhoto} className="absolute bottom-2 right-2 text-white bg-black bg-opacity-50 rounded-2xl p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div className="flex-center flex-col py-5 text-grey-500">
                        <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
                        <label>
                            <img src="/icons/upload.svg" width={77} height={77} alt="file upload" className='cursor-pointer' />
                            <input type="file" accept="image/*" onChange={handleFileChange} name="file" className="hidden" />
                        </label>
                    </div>
                )}
            </div>
        </div>
    )
}
