"use client"

export default function RefreshAssignments () {
    const handleClick = async () => {

        // refresh 23-§0DT NEA- Make a Car
        //const response = await fetch("/api/homework/refresh/265fd007-e375-4f03-9697-756b050ee012/c65e624c-4e1c-4a80-9a96-9c7935db1a47")
        const response = await fetch("/api/homework/refresh/")
        const data = await response.json();

        console.log("Clicked async...", data);

    }
    return <button onClick={handleClick}>Refresh Marking for NEA</button>
}