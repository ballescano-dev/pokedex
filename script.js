import * as pokeapi from './poke_api/api.js';
import * as bootstrap from './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
const img_src_base = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/';

window.addEventListener('load', async function() {
  const form = document.getElementsByTagName('form')[0];
  const pokemon_input = form.elements[1];
  form.onsubmit = async function($event) {
    $event.preventDefault();
    const pokemon = await pokeapi.getPokemonById(pokemon_input.value);
    pokemon_input.value = '';
    showCurrentPokemon(pokemon);
  };

  const all_pokemons = await pokeapi.getAllPokemons();

  fillPokemonGrid(all_pokemons);
  showCurrentPokemon();
});


async function previousPokemon(id) {
  // TODO: HACER EL ID CON MÓDULO
  if (id-1 === 0) id = 10327;
  const previousPokemon = await pokeapi.getPokemonById(id-1);
  return previousPokemon;
}

async function nextPokemon(id) {
  // TODO: HACER EL ID CON MÓDULO
  if (id+1 > 10326) id = 0;
  const nextPokemon = await pokeapi.getPokemonById(id+1);
  return nextPokemon;
}

async function fillPokemonGrid(pokemons) {
  const pokemons_grid = document.getElementsByClassName('catalog-grid')[0];
  pokemons_grid.classList.remove('spinner-border');

  for (const pokemon of pokemons) {
    const div = document.createElement('div');
    div.classList.add('col');
    div.classList.add('pokemon-list');
    div.innerHTML = `
      <img src="${img_src_base}${pokemon.id}.png" alt="${pokemon.name} image" class="img-fluid">
      <span>#${pokemon.id.toString().padStart(3, '0')}</span><p>${pokemon.name.toUpperCase()}</p>
      <span>ELEC</span>
    `;
    pokemons_grid.append(div);
  }
}

async function showCurrentPokemon(pokemon=null) {
  const pokemon_row = document.getElementsByClassName('catalog-grid')[0].children;
  const pokemon_display = document.getElementsByClassName('current-pokemon-pattern')[0];
  
  let current_pokemon_name;
  if (pokemon !== null) {
    current_pokemon_name = pokemon.name;
    await fillPokemonDisplay(pokemon_display, current_pokemon_name);
    return;
  }

  for (const div of pokemon_row) {
    div.onclick = async () => {
      if (pokemon === null) current_pokemon_name = div.children[2].innerHTML;
      pokemon_display.innerHTML = '<div class="spinner-border"></div>';
      await fillPokemonDisplay(pokemon_display, current_pokemon_name);
    }
  }
}

async function fillPokemonDisplay(pokemon_display, pokemon_name) {
  const btn_previous_pokemon = document.getElementById('previous-pokemon');
  const btn_next_pokemon = document.getElementById('next-pokemon');
  const current_pokemon = await pokeapi.getPokemonById(pokemon_name);
    pokemon_display.innerHTML = `
      <div id="header-current-pokemon" class="row">
        <div class="col text-start">
          ID: #${current_pokemon.id.toString().padStart(3, '0')} <i class="bi bi-circle-fill" aria-hidden="true"></i> ${current_pokemon.name.toUpperCase()}
        </div>
        <div class="col text-end">
          MODE: OPTIC-CAPTURE <i class="bi bi-broadcast"></i>
        </div>
      </div>
      <img
        src="${img_src_base}${current_pokemon.id}.png"
        alt="${current_pokemon.name} image"
        class="img-fluid mx-auto d-block"
      />
      <div id="footer-current-pokemon" class="row">
        <div class="col text-start">
          <i class="bi bi-soundwave"></i>
          CRY SYNTH:
        </div>
        <div class="col text-end">
          <i class="bi bi-bar-chart-fill"></i>
          <i class="bi bi-bar-chart-fill"></i>
          <i class="bi bi-reception-1"></i>
        </div>
      </div>
    `;
    const prev_pokemon = await previousPokemon(current_pokemon.id);
    const next_pokemon = await nextPokemon(current_pokemon.id);
    btn_previous_pokemon.innerHTML = `
      <i class="bi bi-arrow-left"></i>
      #${prev_pokemon.id.toString().padStart(3, '0')} ${prev_pokemon.name.toUpperCase()}
    `;
    btn_next_pokemon.innerHTML = `
      #${next_pokemon.id.toString().padStart(3, '0')} ${next_pokemon.name.toUpperCase()}
      <i class="bi bi-arrow-right"></i>
    `;

    const pokemon_title = document.getElementsByClassName('pokemon-title')[0];
    pokemon_title.innerHTML = `
      <div class="col-7"><span>#${current_pokemon.id.toString().padStart(3, '0')}</span> ${current_pokemon.name.toUpperCase()}</div>
      <div class="col-5 text-end"><span class="type-badge">ELEC</span></div>
    `;
}