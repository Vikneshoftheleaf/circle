import { Icon } from "@iconify/react"
export default function BackBtn() {
    return (
        <div className="p-4 flex justify-start items-center text-2xl">
            <button onClick={() => history.back()}>
                <Icon icon="ep:back" />
            </button>
        </div>
    )
}