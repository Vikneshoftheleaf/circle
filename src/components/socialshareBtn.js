"use client";
import {
    FacebookShareButton,
    FacebookIcon,
    PinterestShareButton,
    PinterestIcon,
    RedditShareButton,
    RedditIcon,
    WhatsappShareButton,
    WhatsappIcon,
    LinkedinShareButton,
    LinkedinIcon,
    TwitterIcon,
    TwitterShareButton
} from 'next-share';

export default function SocialShareBtn({url}) {
    return (
        <div className='h-full p-4 flex justify-center items-center gap-4'>
            <FacebookShareButton
                url={url} >
                <FacebookIcon size={54} round />
            </FacebookShareButton>
            <WhatsappShareButton
                url={url} >
                <WhatsappIcon size={54} round />
            </WhatsappShareButton>
            <LinkedinShareButton
                url={url} >
                <LinkedinIcon size={54} round />
            </LinkedinShareButton>
            <TwitterShareButton url={url}>
                <TwitterIcon size={54} round></TwitterIcon>
            </TwitterShareButton>
        </div>
    )
} 
