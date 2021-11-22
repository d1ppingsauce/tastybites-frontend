import React from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { Ingredient, Recipe as RecipeType } from '../types'
import * as apiCall from '../util/api'
import CSS from 'csstype'

type RecipeURLParams = 
    { slug: string
    , api: string
    }

type SerializerIngredient = 
    { ingredient_id: { ingredient_id: number, name: string }
    , qty: number
    , units: string 
    }

// const spinnerContainer: CSS.Properties = {
//     height: '100%',
//     bottom: 0,
//     marginTop: '10%',
//     marginBottom: '10%',
// }
// const spinnerStyle: CSS.Properties = {
//     width: '10rem',
//     height: '10rem',
// }

const Recipe = (props: any) => {
    const history = useHistory()

    const { slug, api } = useParams<RecipeURLParams>()
    const [ ingredients, setIngredients ] = React.useState<Ingredient[]>([])
    const [ loading, setLoading ] = React.useState<Boolean>(true)
    // const [ apiIngredients, setApiIngredients ] = React.useState<Ingredient[]>([])
    const recipe = props.recipes.find((r: RecipeType) => r.slug === slug)
    const [ apiRecipe, setApiRecipe ] = React.useState<RecipeType>({
        name: "",
        recipe_id: -1,
        url: "",
        servings: 0,
        ingredients: [],
        instructions: [],
        slug: "",
        api: true,
        user: 0,
        image: ''
        , gluten_free: false
        , dairy_free: false
        , low_carb: false
        , low_calorie: false
        , vegetarian: false
        , vegan: false
        , cuisine: ""
    })
    
    

    /**
     * 
     * get ingredient information associated with recipe when recipe
     * is not from the spoonacular api
     * 
    */
    React.useEffect(() => {
        if (api !== 'true') {
            apiCall.getIngredients(recipe.recipe_id)
                .then(ings => {
                    setIngredients([...ings.map((i: SerializerIngredient) => {
                            return { name: i.ingredient_id.name
                                , id: i.ingredient_id.ingredient_id
                                , qty: i.qty
                                , units: i.units
                            }
                        }) 
                    ])
                    setLoading(false)
                })
        } else {
            apiCall.getApiRecipe(+slug.split('-')[0])
                .then(response => setApiRecipe(response))
        }
    }, [])

    
    // calls if the recipe accessed is from the api.
    React.useEffect(() => {
        if (apiRecipe.recipe_id !== -1) {
            parseApiIngredients(apiRecipe)
            setLoading(false)
        }
    }, [apiRecipe])
    

    // format api ingredient items for proper display
    const parseApiIngredients = (recipe: RecipeType) =>
        setIngredients([...recipe.ingredients.map((i:any) => {
            return {
                name: i.name,
                id: i.id,
                qty: i.amount,
                units: i.unit
            }
        })])
        // recipe.ingredients.map(r => ({
        //     id: r.id,
        //     name: r.name,
        //     qty: r.qty,
        //     units: r.units
        // }))


    const renderRecipe = (r: RecipeType) => {
        return (
            <div className='container'>
                <div className="row p-3"><br /></div><div className="row p-3"><br /></div>
                <button className='previous-page' onClick={() => history.goBack()}><i className="fas fa-arrow-circle-left fa-3x"></i></button>
                <div className="row p-3"><br /></div>
                <div className='container-fluid'>
                    <div className='card recipe-card mx-auto'>
                        <img src={r.image} alt={r.name} className='extended-card card-img-top' height='400' width='500'/>
                            <h2 className='card-title card-header'>{r.name}</h2>
                            <div className='list-group list-group-flush'>
                                <div className='list-group-item ingredients'>
                                    <h3>Ingredients</h3>
                                    <ul>{ingredients.map((ing, k) => <li key={k}>{ing.qty + " " + ing.units + " " + ing.name}</li>)}</ul>
                                </div>
                                <div className='list-group-item instructions'>
                                    <h3>Instructions</h3>
                                    <ol>{api ==="true" ? r.instructions.map((inst: string, k: number) => <li key={k}>{inst}</li>) 
                                                        : JSON.parse(r.instructions.toString()).map((inst: string, k: number) => 
                                                                                                            <li key={k}>{inst}<hr /></li>)}</ol>
                                </div>
                            </div>
                            <div className="card-footer text-center">
                                <a href={r.url} className='btn btn-outline-secondary'>Source</a>
                            </div>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            { loading ? <div className='container-fluid d-flex justify-content-center spin-content'>
                            <div className='spin spinner-border spinner-border-xl text-secondary page' role='status'>
                                <span className='sr-only'>Loading...</span>
                            </div> 
                        </div>
            
                : renderRecipe(api === "true" ? apiRecipe : recipe) }
        </div>
    )

}

export default Recipe