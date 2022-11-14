import React from 'react'
import { Label, Box, DropZone, DropZoneProps, DropZoneItem } from '@adminjs/design-system'
import { BasePropertyProps } from 'adminjs'

const MyInputComponent: React.FC<BasePropertyProps> = (props) => {
    const { property, onChange, record } = props

    const handleDropZoneChange: DropZoneProps['onChange'] = (files) => {
        const formData = new FormData();
        formData.append('image', files[0]);

        fetch('https://api.imgbb.com/1/upload?key=18d849e40f3ae34587573c4996022988', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data["data"]["display_url"]);
                onChange(props.property.name, data["data"]["display_url"]);
            })
            .catch(error => {
                console.error(error)
            })
    }

    const uploadedPhoto = record?.params.profilePhotoLocation
    const photoToUpload = record?.params[property.name]

    return (
        <Box marginBottom="xxl">
            <Label>{property.label}</Label>
            <DropZone onChange={handleDropZoneChange}/>
            {uploadedPhoto && !photoToUpload && (
                <DropZoneItem src={uploadedPhoto} />
            )}
        </Box>
    )
}

export default MyInputComponent