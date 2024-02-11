"use client";
import {
    FacebookShareButton,
    FacebookIcon,
    WhatsappShareButton,
    WhatsappIcon,
    TwitterIcon,
    TwitterShareButton,
    InstapaperShareButton,
    InstagramIcon,
    GabShareButton,
    GabIcon
} from 'next-share';

import { Icon } from '@iconify/react';

import { useState,useEffect } from 'react';

export default function SocialShareBtn({ url }) {
    const [copied, setcopied] = useState(false)

    function copy(url)
    {

        navigator.clipboard.writeText(url)
        setcopied(true)
        
    }
    return (
        <div className='h-full p-4 flex justify-center items-center gap-4'>

            <div className='h-[54px] w-[54px] rounded-full bg-gray-200 dark:bg-white/20 dark:backdrop-blur-md flex justify-center items-center'>
                <button onClick={()=> copy(url)}>
                {copied?<Icon icon="material-symbols:content-copy"  height={24} width={24} />:<Icon icon="material-symbols:content-copy-outline" height={24} width={24}/>}

                </button>
            </div>

            <InstapaperShareButton url={url}>
                <InstagramIcon size={54} round></InstagramIcon>
            </InstapaperShareButton>

            <WhatsappShareButton
                url={url} >
                <WhatsappIcon size={54} round />
            </WhatsappShareButton>


            <FacebookShareButton
                url={url} >
                <FacebookIcon size={54} round />
            </FacebookShareButton>

            <TwitterShareButton url={url}>
                <TwitterIcon size={54} round></TwitterIcon>
            </TwitterShareButton>

        </div>
    )
} 
