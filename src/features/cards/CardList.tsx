import 'react'
import './CardList.css'
import { NavButton } from '../button/NavButton'
import { Spinner } from '../spinner/Spinner'
import { useNavigation } from 'react-router';

export function CardList({ children } : {children?: React.ReactNode}) {
  const { state: navState } = useNavigation();
  const isLoading = navState !== "idle";

  return (
    <div>
      <div className='links'>
        <NavButton to='/allcards' returnTo='/mycards'>View All</NavButton>
        <NavButton to='/mycards?onlyowned=true' returnTo='/mycards'>Only Owned</NavButton>
      </div>
      <div className='card-list'>
          {children}
          {isLoading && <Spinner />}
      </div>
    </div>
  )
}