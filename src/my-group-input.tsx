import React from 'react'
import { useCurrentAdmin } from 'adminjs'
import { Label, Box, Input} from '@adminjs/design-system'
//useCurrentAdmin();
const MyGroupInput = () => {
    const [currentAdmin, setCurrentAdmin] = useCurrentAdmin()
    return (
        <Box>
            <Label>Group</Label>
            <Input value={currentAdmin.group} readOnly={true} disabled />
        </Box>
    )
    //return <input value={currentAdmin.group} /> // style={{ display: 'none' }} />
}

export default MyGroupInput