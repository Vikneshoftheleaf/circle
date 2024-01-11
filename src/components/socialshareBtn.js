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

export default function SocialShareBtn({ url }) {
    return (
        <div className='h-full p-4 flex justify-center items-center gap-4'>
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
