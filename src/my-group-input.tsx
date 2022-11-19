import React from 'react'
import { useCurrentAdmin, BasePropertyProps } from 'adminjs'
import { Label, Box, Input} from '@adminjs/design-system'
//useCurrentAdmin();
const { currentAdmin, setCurrentAdmin } = useCurrentAdmin()
const MyGroupInput: React.FC<BasePropertyProps> = (props) => {
    const { property, onChange, record } = props
    onChange(props.property.name, currentAdmin.group);

    return (
        <Box marginBottom="xxl">
            <Label>{property.label}</Label>
            <Input value={currentAdmin.group} readonly={ true } disabled></Input>
            {/* <DropZone onChange={handleDropZoneChange} />
            {uploadedPhoto && !photoToUpload && (
                <DropZoneItem src={uploadedPhoto} />
            )} */}
        </Box>
    )
}

export default MyGroupInput