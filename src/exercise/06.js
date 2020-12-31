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
  const [pokemon, setPokemon] = React.useState()
  const [error, setError] = React.useState(null)
  const [status, setStatus] = React.useState(Status.IDLE)

  React.useEffect(() => {
    if (pokemonName) {
      setStatus(Status.PENDING)

      fetchPokemon(pokemonName)
        .then(pokemonData => {
          setPokemon(pokemonData)
          setStatus(Status.RESOLVED)
        })
        .catch(err => {
          setError(err)
          setStatus(Status.REJECTED)
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
