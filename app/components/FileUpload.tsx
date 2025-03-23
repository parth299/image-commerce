"use client";

import { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

export default function FileUpload({onSuccess}: {onSuccess: (response: IKUploadResponse) => void}) {

    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onError = (err: {message: string}) => {
        setError(err.message);
        setUploading(false);
    }

    const handleSuccess = (response: IKUploadResponse) => {
        setError(null);
        setUploading(false);
        onSuccess(response);
    }

    const handleStartUpload = () => {
        setUploading(true);
        setError(null);
    }
    

    return (
        <div className="space-y-2">
            File Upload
            <IKUpload  
                fileName="product-image.png"
                onError={onError}
                onSuccess={handleSuccess}
                onUploadStart={handleStartUpload}
                validateFile={(file: File) => {
                    const validTypes = ["image/png", "image/jpeg", "image/webp"];

                    if(!validTypes.includes(file.type)) {
                        setError("Invalid File Type");
                    }
                    if(file.size > 5*1024*1024) {
                        setError("File size is too large (limit: 5mb)");
                    }

                    return true;
                }}
            />

            {uploading && (
                <p className="text-sm text-gray-500">Uploading...</p>
            )}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}

