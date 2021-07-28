import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import pokemon from 'pokemon';
import Pokemon from './components/Pokemon';

const ApiPokemon = 'https://pokeapi.co/api/v2';

export default class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false, // decide si hay que mostrar la actividad
      searchInput: '', // el texto actual que se introduce
      name: '', // nombre de pokemon
      pic: '', // URL de la imagen del pokemon
      types: [], // Tipo de pokemon
      desc: '', // descripcion del pokemon
    };
  }

  render() {
    const { name, pic, types, desc, searchInput, isLoading } = this.state; // saca los datos del estado del pokemon
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.headContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                onChangeText={(searchInput) => this.setState({ searchInput })}
                value={this.state.searchInput}
                placeholder="Buscar Pokémon"
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                onPress={this.buscarPokemon}
                title="Buscar"
                color="#0064e1"
              />
            </View>
          </View>

          <View style={styles.mainContainer}>
            {isLoading && <ActivityIndicator size="large" color="#0064e1" />}

            {!isLoading && (
              <Pokemon name={name} pic={pic} types={types} desc={desc} />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  buscarPokemon = async () => {
    try {
      const pokemonID = pokemon.getId(this.state.searchInput); // comprueba si el nombre del pokemon es valido

      this.setState({
        isLoading: true, // muestra como se carga mientras realiza la solicitud
      });

      const { data: pokemonData } = await axios.get(
        `${ApiPokemon}/pokemon/${pokemonID}`
      );
      const { data: pokemonSpecieData } = await axios.get(
        `${ApiPokemon}/pokemon-species/${pokemonID}`
      );

      const { name, sprites, types } = pokemonData;
      const { flavor_text_entries } = pokemonSpecieData;

      this.setState({
        name,
        pic: sprites.front_default,
        types: this.getTypes(types),
        desc: this.getDescription(flavor_text_entries),
        isLoading: false, // hide loader
      });
    } catch (err) {
      Alert.alert('Error', 'Pokémon no encontrado');
    }
  };

  getTypes = (types) =>
    types.map(({ slot, type }) => ({
      id: slot,
      name: type.name,
    }));

  getDescription = (entries) =>
    entries.find((item) => item.language.name === 'es').flavor_text;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  headContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 100,
  },
  textInputContainer: {
    flex: 2,
  },
  buttonContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 9,
  },
  textInput: {
    height: 35,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#eaeaea',
    padding: 5,
  },
});