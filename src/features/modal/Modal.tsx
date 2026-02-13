import 'react'
import './Modal.css'
import { useModal } from "../../app/ModalProvider";
import { Card } from '../cards/Card';

export function Modal() {
    const { modalData, closeModal } = useModal();

    const card = modalData?.card;
    return (
        <div className={'blackout' + (!modalData ? ' hidden' : '')} onClick={closeModal}>
            {card &&
                <Card card={card} big />
            }
        </div>
    )
}