import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import useLensAuth from '../../../hooks/useLensAuth'
import useLensProfiles from '../../../hooks/useLensProfiles'
import useWindowDimensions from '../../../hooks/window-dimensions.hook'
import { User } from '../../../models/User/user.model'
import { AuthSlice, deleteTokens, setTokens } from '../../../store/reducers/auth.reducer'
import { removeUser, setUser } from '../../../store/reducers/user.reducer'
import { RootState } from '../../../store/store'
import { CreateNewMemeBtn } from '../../Buttons/CreateNewMemeButton'
import { RefreshNewMemeBtn } from '../../Buttons/RefreshNewMemeButton'
import { CustomConnectButton } from '../../Buttons/CustomConnectButton/index'
import { ProfileButton } from '../../Buttons/ProfileButton'
import { SelectProfile } from '../../Modals/SelectProfile'
import { useRouter } from 'next/router'

export const Header: React.FC<{}> = () => {
    const { width } = useWindowDimensions();
    const  { address }  = useAccount();
    const [show, setShow] = useState(false);
    const user: User | null = useSelector((state: RootState) => state.user.selectedUser);
    const auth: AuthSlice = useSelector((state: RootState) => state.auth)
    const { haveAuth } = useLensAuth(address)
    const dispatch = useDispatch();

    const { data: profilesData } = useLensProfiles()

    const reloadPage = () => {
        if(router.pathname === '/'){
            window.location.reload();
        }
     }

    const handleProfileSelected = (profile: User) => {
        dispatch(setUser(profile));
        setShow(false);
    }
    const router = useRouter()
    useEffect(() => {
        if(haveAuth && !user && profilesData) {
            setShow(true)
        }
    }, [ haveAuth, profilesData, user])

    useEffect(() => {
        if(!address) {
            dispatch(setUser(null))
            dispatch(deleteTokens())
        }
    })

    return (
        <>
            <SelectProfile onClose={() => { setShow(false) }} onProfileSelected={handleProfileSelected} show={show} />
            <nav className="flex w-full p-4 sm:p-4 lg:p-12">
                <Link href="/">
                    <Image onClick={reloadPage} className="cursor-pointer w-1/2 h-auto" src="/logo.svg" alt="me" width={width > 850 ? "188.5": "120.25"} height={width > 850 ? "60.1" : "40.5"} />
                </Link>
                <div className='flex ml-auto items-center gap-[10px] lg:gap-[20px]'>
                    {router.pathname === '/' ? <RefreshNewMemeBtn/> : ''}
                    <CreateNewMemeBtn disabled={!user} />
                    <CustomConnectButton />
                    <ProfileButton disabled={!user} />
                </div>
            </nav>
        </>
    )
}