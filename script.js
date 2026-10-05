import {getAllPokemons, getPokemonById} from './poke_api/api.js';
import * as bootstrap from './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

window.addEventListener('load', async function() {
    const form = document.getElementsByTagName('form')[0];
    const pokemonInput = form.elements[1];
    const btnPreviousPokemon = document.getElementById('previous-pokemon');
    const btnNextPokemon = document.getElementById('next-pokemon');
    let currentPokemon;

    form.onsubmit = async function($event) {
        $event.preventDefault();
        const pokemon = await getPokemonById(pokemonInput.value);
        console.log(pokemon);
        // currentPokemon = pokemon;
    };

    // btnPreviousPokemon.onclick = nextPokemon(currentPokemon.id);
});

async function nextPokemon(id) {
    if (id-1 === 0) id = 1026;
    const previousPokemon = await getPokemonById(id-1);
    console.log(previousPokemon);
}