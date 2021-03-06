import React from 'react'
import { useHistory } from 'react-router-dom'
import { Recipe, UserMetadata} from '../types'
import { RecipeList } from '.'


type ProfileParams =
    { loggedIn: boolean
    , loading: boolean
    , user: UserMetadata
    , userRecipes: Recipe[]
    , onFavorite: (r: number, a: boolean) => void
    , onRandomButton: () => void
    , onMoreButton: (cond: any) => void
    , disabled: boolean
    , onButton: (r: Recipe, i: number) => any
    , onDelete: (r: Recipe) => any
    }

const Profile = (props: ProfileParams) => {
    const history = useHistory()
    const [ recipes, setRecipes ] = React.useState(props.userRecipes)
    const [ filter, setFilter] = React.useState(0)

    // go to login / homepage if user is not logged in
    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            // api.getCurrentUser()
            //     .then(response => setProfile(response))
        } else {
            history.push('/login/')
        }
    },[])


    return (
        <> { !props.loggedIn && props.loading ? 
            <div className='container-fluid d-flex justify-content-center spin-content p-5'>
                <div className='spin spinner-border spinner-border-xl text-secondary p-5' role='status'>
                    <span className='sr-only'>Loading...</span>
                </div> 
            </div>
        : <div className='container-fluid'>
            <div className="row p-3"><br /></div>
                <div className='container row position-relative profile-info'>
                    <div className='col-3 p-4'>
                        <img width='100px' height='100px' src="https://d2i7h2wv1n9itn.cloudfront.net/media/img/bev.png" alt='profile icon'/>
                    </div>
                    <div className='col-sm p-4 user-info'>
                        <div className='text-muted'>Welcome,</div>
                        <h1>{props.user.first_name + ' ' + props.user.last_name}</h1>
                        <p className='text-muted'>@{props.user.username}</p>
                    </div>
                    <div className='row text-center p-3'>
                        <div className='btn-group' role='group'>                            
                            <input type='radio' className='btn-check' name='btnradio' 
                                onChange={ () => setFilter(1) }
                                autoComplete='off'
                                aria-label='my recipes button' 
                                id='myrecipes'/>
                            <label className='btn btn-outline-secondary' htmlFor='myrecipes'>My Recipes</label>

                            <input type='radio' className='btn-check' name='btnradio' 
                                onChange={ () => setFilter(2) }
                                autoComplete='off'
                                aria-label='my favorites button'
                                id='favorites'/>
                            <label className='btn btn-outline-secondary' htmlFor='favorites'>My Favorites</label>

                            <input type='radio' className='btn-check' name='btnradio' 
                                onChange={ () => setFilter(3) }
                                autoComplete='off'
                                aria-label='my favorites button'
                                id='private'/>
                            <label className='btn btn-outline-secondary' htmlFor='private'>My Privated</label>
                        </div>
                    </div>
                </div>
            
            <div className="container">
                <div className="row">
                    <RecipeList recipes={recipes} 
                                loggedIn={props.loggedIn} 
                                user={props.user}
                                onFavorite={props.onFavorite} 
                                onDelete={props.onDelete} 
                                disabled={props.disabled} 
                                onButton={props.onButton}
                                userSpecific={filter}
                                onRandomButton={props.onRandomButton}
                                onMoreButton={props.onMoreButton}
                                pulling={false}
                                loading={props.loading}
                                />
                </div>
            </div>
        </div>
        } </>)
}

export default Profile