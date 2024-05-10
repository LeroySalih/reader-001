"use client"
import Button from "@mui/material/Button";

export default function RefreshAssignments () {

    const handleClick = async () => {

        const response = await fetch("/api/homework/refresh/")
        const data = await response.json();

    }

    return <><Button onClick={handleClick}>Refresh Marking</Button></>
}