"use client";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
export default function Videos() {
    const [playing, setplaying] = useState(true)
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef) {
            videoRef.current.play()
        }
    }, [videoRef])
    return (
        <div className="bg-slate-900 w-[450px] h-[750px] sm:h-screen sm:w-screen relative object-cover overflow-x-hidden overflow-y-scroll snap-mandatory snap-y no-scrollbar">
            <div className="h-full w-full">
                <div className="absolute top-0 bottom-0 left-0 right-0 z-20 h-full w-full flex justify-center items-center">
                    <button className="text-slate-100 text-xl" onClick={() => { setplaying(!playing) }}>
                        {playing ? <Icon icon="ic:round-pause" onClick={() => { videoRef.current.pause() }} /> : <Icon icon="ph:play-fill" onClick={() => { videoRef.current.play() }} />}
                    </button>
                </div>

                <video className="h-full w-full border border-2 snap-center" ref={videoRef} src="https://drive.google.com/uc?export=download&id=14f52gTFrr5gANkQ3WhZXnTjzjxYq8DID"></video>


            </div>

            <div className="h-full w-full">
                <div className="absolute top-0 bottom-0 left-0 right-0 z-20 h-full w-full flex justify-center items-center">
                    <button className="text-slate-100 text-xl" onClick={() => { setplaying(!playing) }}>
                        {playing ? <Icon icon="ic:round-pause" onClick={() => { videoRef.current.pause() }} /> : <Icon icon="ph:play-fill" onClick={() => { videoRef.current.play() }} />}
                    </button>
                </div>

                <video className="h-full w-full border border-2 snap-center" ref={videoRef} src="https://drive.google.com/uc?export=download&id=14f52gTFrr5gANkQ3WhZXnTjzjxYq8DID"></video>


            </div>

            <div className="h-full w-full">
                <div className="absolute top-0 bottom-0 left-0 right-0 z-20 h-full w-full flex justify-center items-center">
                    <button className="text-slate-100 text-xl" onClick={() => { setplaying(!playing) }}>
                        {playing ? <Icon icon="ic:round-pause" onClick={() => { videoRef.current.pause() }} /> : <Icon icon="ph:play-fill" onClick={() => { videoRef.current.play() }} />}
                    </button>
                </div>

                <video className="h-full w-full border border-2 snap-center" ref={videoRef} src="https://drive.google.com/uc?export=download&id=14f52gTFrr5gANkQ3WhZXnTjzjxYq8DID"></video>


            </div>

        </div>
    )
}