import Image from "next/image"
export default function Screen() {
    return (

        <>
            <div className="h-screen flex justify-center items-center">

                <span className="relative flex h-[100px] w-[100px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full -z-10 bg-red-400 opacity-75"></span>
                    <Image src={'/favicon.png'} height={100} width={100} priority alt="screen"></Image>
                </span>
            </div>
        </>
    )
}