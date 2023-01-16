import React, {useCallback, useState, useEffect} from 'react';
import { Ionicons } from '@expo/vector-icons';


import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Feather } from '@expo/vector-icons';

import { useFocusEffect } from '@react-navigation/native';

import uudi from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

function Class({ navigation, route }) {

  const [pres, setPresenca] = useState(parseInt([route.params.qtdAulasFrequentada]));
  const [falt, setFalta] = useState(parseInt([route.params.qtdAulasComFalta]));
  
  async function remove(id){
    
    const response = await AsyncStorage.getItem("@faltas:databases");

    const previousData = response ? JSON.parse(response) : [];

    const data = previousData.filter((item) => item.id !== id);

    await AsyncStorage.setItem("@faltas:databases", JSON.stringify(data));
    alert('Disciplina excluída com sucesso!')
    navigation.goBack();
  }

  async function presenca(id, nome, qtdFaltas, qtdAulas, qtdAulasComFalta, qtdAulasFrequentada) {

    const response = await AsyncStorage.getItem("@faltas:databases");
    const previousData = response ? JSON.parse(response) : [];
    const data = previousData.filter((item) => item.id !== id);
    await AsyncStorage.setItem("@faltas:databases", JSON.stringify(data));

    qtdAulasFrequentada = parseInt(qtdAulasFrequentada);
    qtdAulasComFalta = parseInt(qtdAulasComFalta);
    const newData = {
      id,
      nome, 
      qtdFaltas,
      qtdAulas,
      qtdAulasComFalta,
      qtdAulasFrequentada: qtdAulasFrequentada + 2,
    }

    const response1 = await AsyncStorage.getItem("@faltas:databases");
    const previousData1 = response1 ? JSON.parse(response1) : [];
    const data1 = [...previousData1, newData];
    await AsyncStorage.setItem("@faltas:databases", JSON.stringify(data1));
    parseInt(setPresenca(pres + 2))
  }

  async function falta(id, nome, qtdFaltas, qtdAulas, qtdAulasComFalta, qtdAulasFrequentada) {

    const response = await AsyncStorage.getItem("@faltas:databases");
    const previousData = response ? JSON.parse(response) : [];
    const data = previousData.filter((item) => item.id !== id);
    await AsyncStorage.setItem("@faltas:databases", JSON.stringify(data));

    qtdAulasFrequentada = parseInt(qtdAulasFrequentada);
    qtdAulasComFalta = parseInt(qtdAulasComFalta);
    const newData = {
      id,
      nome, 
      qtdFaltas,
      qtdAulas,
      qtdAulasComFalta: qtdAulasComFalta + 2,
      qtdAulasFrequentada,
    }

    const response1 = await AsyncStorage.getItem("@faltas:databases");
    const previousData1 = response1 ? JSON.parse(response1) : [];
    const data1 = [...previousData1, newData];
    await AsyncStorage.setItem("@faltas:databases", JSON.stringify(data1));
    parseInt(setFalta(falt + 2))
  }
  
  useFocusEffect( useCallback(() => {}, []));

  navigation.setOptions({title: route.params.nome})
  return (
    <View style={styles.all}>
      <View style={styles.headerClass}>
        <Text style={styles.headerClassName}> {route.params?.nome} </Text>
        
        <TouchableOpacity
          onPress={()=> {
            Alert.alert(
              "Você deseja excluir a disciplina?",
              "Clique em 'Desejo excluir' para confirmar.\n",
            [
              {
                text: "Cancelar",
                
              },
              { 
                text: "Desejo excluir", 
                onPress: () =>  remove(route.params.id) 
              }
            ])
          }}
        >
          <Feather name="delete" size={27} color="red" />
        </TouchableOpacity>
       
      </View>       
      
      <View style={styles.cardsClass}>
        <Text style={styles.cardsClassTitle}> Total de aulas: </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.cardsClassContent}> {route.params?.qtdAulas} </Text>
          <View></View>
        </View>
      </View>       
      
      <View style={styles.cardsClass}>
        <Text style={styles.cardsClassTitle}> Total de faltas permitidas: </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.cardsClassContent}> {route.params?.qtdFaltas} </Text>
          <View></View>
        </View>
      </View>       

      <View style={styles.cardsClass}>
        <Text style={styles.cardsClassTitle}> Aulas frequentadas: </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.cardsClassContent, styles.frequentadas]}> {pres} </Text>
          <View></View>
        </View>
      </View>  

      <View style={styles.cardsClass}>
        <Text style={styles.cardsClassTitle}> Aulas faltadas </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.cardsClassContent, styles.faltas]}> {falt} </Text>
          <View></View>
        </View>
      </View>       

      <View>
        <TouchableOpacity
          style={[styles.frequentadas, styles.buttonPresenca]}
          activeOpacity={0.7}
          onPress={()=> {
            presenca(route.params.id, route.params.nome, route.params.qtdFaltas, route.params.qtdAulas, route.params.qtdAulasComFalta, route.params.qtdAulasFrequentada);
          }}  
        >
          <Text style={styles.titleButton}> Marcar presença</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.faltas, styles.buttonPresenca]}
          activeOpacity={0.7}
          onPress={()=> {
            falta(route.params.id, route.params.nome, route.params.qtdFaltas, route.params.qtdAulas, route.params.qtdAulasComFalta, route.params.qtdAulasFrequentada);
          }}
          >
          <Text style={styles.titleButton}> Marcar falta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HomeScreen({navigation}) {

  const [data, setData] = useState([]);

  async function pegarDados(){
    const response = await AsyncStorage.getItem("@faltas:databases");

    const data = response ? JSON.parse(response) : [];
    setData(data);

    console.log(data);

  }

  useFocusEffect( useCallback(() => {
    pegarDados();
  }, []));

  return (
    <View style={styles.all}>
      
      {
        data.map((item) => (
          <View style={styles.disc}>
          
          <TouchableOpacity style={styles.butts}
            onPress={()=> {
              navigation.navigate('Class', {
                id: item.id, 
                nome: item.nome,
                qtdAulas: item.qtdAulas,
                qtdFaltas: item.qtdFaltas,
                qtdAulasComFalta: item.qtdAulasComFalta,
                qtdAulasFrequentada: item.qtdAulasFrequentada,
              }
            )}}
            activeOpacity={0.7}
          >
            <Text style={styles.nameDisc}> { item.nome } </Text>
            <Feather name="arrow-right-circle" size={30} color="black" />
          </TouchableOpacity>
        </View>
            
        ))
      }

      <TouchableOpacity
        onPress={() => navigation.navigate('Adicionar nova disciplina')}
        style={styles.add}
        activeOpacity={0.7}>
        
        <Ionicons name="md-add-circle-outline" size={40} color="#bf2920" />
        <Text style={styles.nameAdd}>Adicionar nova disciplina</Text>

      </TouchableOpacity>

    </View>
  );
}

function Add({navigation}) {
  const [nome, setNome] = useState('');
  const [qtdFaltas, setQtdFaltas] = useState('');
  const [qtdAulas, setQtdAulas] = useState('');
  const [qtdAulasComFalta, setQtdAulasComFalta] = useState('');
  const [qtdAulasFrequentada, setQtdAulasFrequentada] = useState('');
  
  async function save(){

    try {
      const id = uudi.v4();
      
      const newData = {
        id,
        nome, 
        qtdFaltas,
        qtdAulas,
        qtdAulasComFalta,
        qtdAulasFrequentada
      }

      const response = await AsyncStorage.getItem("@faltas:databases");

      const previousData = response ? JSON.parse(response) : [];
      const data = [...previousData, newData];

      await AsyncStorage.setItem("@faltas:databases", JSON.stringify(data));
      Toast.show({
        type: "success",
        text1: "Disciplina salva com sucesso!",
        text2: 'Volte para a tela inicial e veja. 🤩'
      })
      
    } catch(error){
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Não foi possível salvar!",
      })
    }
    
  }

  return (
    <View style={styles.all}>
      
      <TextInput
        placeholder="Digite o nome da disciplina"
        placeholderTextColor={"#9B9B9B"}
        name="nome"
        style={styles.input}
        value={nome}
        onChangeText = {(texto) => setNome(texto)}
      />

      <TextInput
        placeholder="Digite o número de faltas permitidas"
        style={styles.input}
        name="qtdFaltas"
      
        placeholderTextColor={"#9B9B9B"}
        keyboardType="numeric"
        value={qtdFaltas}
        onChangeText = {(texto2) => setQtdFaltas(texto2)}
      />
      
      <TextInput
        placeholder="Digite o número de aulas"
        style={styles.input}
        name="qtdAulas"
      
        placeholderTextColor={"#9B9B9B"}
        keyboardType="numeric"
        value={qtdAulas}
        onChangeText = {(texto3) => setQtdAulas(texto3)}
      />

      <TextInput
        placeholder="Aulas com falta:"
        style={styles.input}
        name="qtdAulasComFalta"
      
        placeholderTextColor={"#9B9B9B"}
        keyboardType="numeric"
        value={qtdAulasComFalta}
        onChangeText = {(texto4) => setQtdAulasComFalta(texto4)}
      />
      
      <TextInput
        placeholder="Aulas frequentadas:"
        style={styles.input}
        name="qtdAulasFrequentadas"
      
        placeholderTextColor={"#9B9B9B"}
        keyboardType="numeric"
        value={qtdAulasFrequentada}
        onChangeText = {(texto5) => setQtdAulasFrequentada(texto5)}
      />

      <TouchableOpacity
        style={styles.cta}
        onPress={save}
      >
          
        <Text style={styles.nameCta}>
          Salvar disciplina
        </Text>
      </TouchableOpacity>

      <Toast  position='bottom' />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Home" >
        <Stack.Screen
          name="Faltas"
          component={HomeScreen}
          options={{
            title: `Disciplinas`
          }} />
        <Stack.Screen name="Adicionar nova disciplina" component={Add} />

        <Stack.Screen
          name="Class"
          component={Class} 
          options={{
            title: ``
          }}
        
        />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}


const styles = StyleSheet.create({
  
  all: {
    backgroundColor: "#fff",
    height: "100%",
    padding: 20,
  },
  butts: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderColor: "#000",
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  nameDisc:{
    fontSize: 18,
    fontWeight: "bold"
  },
  add: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderColor: "#bf2920",
    borderRadius: 15,
    borderWidth: 2,
  },
  nameAdd: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#bf2920",
    marginLeft: 10,
  },
  input: {
    borderColor: "#9B9B9B",
    borderRadius: 15,
    borderWidth: 2,
    padding: 20,
    marginBottom: 10,
  },
  cta: {
    borderColor: "#228662",
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center"
  },
  nameCta: {
    color: "#228662",
    fontSize: 18,
    fontWeight: "bold"
  },
  headerClass: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center"
  },
  headerClassName: {
    fontSize: 22,
    fontWeight: "bold"
  },
  cardsClass: {
    padding: 20,
    backgroundColor: "#F3F3F3",
    width: "100%",
    borderRadius: 15,
    marginBottom: 10,
  },
  cardsClassTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  cardsClassContent: {
    padding: 10,
    color: "#1976D2",
    backgroundColor: "#1976D240",
    borderRadius: 15,
    fontWeight: "bold",
    fontSize: 20,
  },
  faltas: {
    color: "#FF3232",
    backgroundColor: "#FF323240",
  },
  frequentadas: {
    color: "#228662",
    backgroundColor: "#22866240",
  },
  buttonPresenca: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  titleButton: {
    fontSize: 18,
    fontWeight: "bold",
  }
});
