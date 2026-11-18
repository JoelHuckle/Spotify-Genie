export default function Login(){

    function spotifyLogin(){
        window.location.href = `http://localhost:2000/login`;
    }

    return(
        <>
            <button onClick={spotifyLogin}>Login</button>
        </>
    )
}
