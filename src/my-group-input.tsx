import React from 'react'
import { Label, Box, Input, DropZone, DropZoneProps, DropZoneItem } from '@adminjs/design-system'
import { BasePropertyProps, useCurrentAdmin } from 'adminjs'

const MyInputComponent: React.FC<BasePropertyProps> = (props) => {
    const { property, onChange, record } = props
    // const { currentAdmin, setCurrentAdmin } = useCurrentAdmin
    // const currentAdmin = context
    const [currentAdmin] = useCurrentAdmin();
    const role = currentAdmin.role != 'admin'
    return (
        <Box  marginBottom="xxl">
            <Label>{property.label}</Label>
            <Input defaultValue={currentAdmin.group} readOnly={role}></Input>
        </Box>
    )
}

export default MyInputComponent