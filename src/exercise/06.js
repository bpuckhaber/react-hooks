// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

const Status = Object.freeze({
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
})

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState(() => ({
    status: Status.IDLE,
  }))

  const {pokemon, status, error} = state

  React.useEffect(() => {
    if (pokemonName) {
      setState({status: Status.PENDING})

      fetchPokemon(pokemonName)
        .then(pokemonData => {
          setState({status: Status.RESOLVED, pokemon: pokemonData})
        })
        .catch(err => {
          setState({error: err, status: Status.REJECTED})
        })
    }
  }, [pokemonName])

  if (status === Status.IDLE) {
    return 'Submit a pokemon'
  }

  if (status === Status.PENDING) {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (status === Status.REJECTED) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  }

  if (status === Status.RESOLVED) {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('Unexpected error occurred')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
