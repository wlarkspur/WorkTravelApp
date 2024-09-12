import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Fontisto from "@expo/vector-icons/Fontisto";

const STORAGE_KEY = "myKey";
const STATUS_KEY = "statusKey";
const DONE_KEY = "doneKey";
const DONE_KEY_WORK = "doneKeyWork";

export default function App() {
  const [working, setWorking] = useState();
  const [doneTravel, setDoneTravel] = useState(false);
  const [doneWork, setDoneWork] = useState(false);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadToDos();
    loadWorking();
    loadDoneTravel();
    loadDoneWork();
  }, []);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  useEffect(() => {
    if (working !== undefined && working !== null) {
      saveWorking();
    }
  }, [working]);
  useEffect(() => {
    if (doneTravel !== undefined && doneTravel !== null) {
      saveDoneTravel();
    }
  }, [doneTravel]);
  useEffect(() => {
    if (doneWork !== undefined && doneWork !== null) {
      saveDoneWork();
    }
  }, [doneWork]);
  const toggle = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].done = !newToDos[key].done;
    setToDos(newToDos);
    saveToDos(newToDos);
    console.log(newToDos);
  };

  const saveDoneWork = async () => {
    if (doneWork !== undefined && doneWork !== null) {
      await AsyncStorage.setItem(DONE_KEY_WORK, JSON.stringify(doneWork));
    } else {
      console.log("Invalid value for doneWork", doneWork);
    }
  };
  const loadDoneWork = async () => {
    try {
      const doneWork = await AsyncStorage.getItem(DONE_KEY_WORK);
      if (doneWork !== null) {
        setDoneWork(JSON.parse(doneWork));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const saveDoneTravel = async () => {
    if (doneTravel !== undefined && doneTravel !== null) {
      await AsyncStorage.setItem(DONE_KEY, JSON.stringify(doneTravel));
    } else {
      console.log("Invalid value for working", doneTravel);
    }
  };
  const loadDoneTravel = async () => {
    try {
      const doneTravel = await AsyncStorage.getItem(DONE_KEY);
      if (doneTravel !== null) {
        setDoneTravel(JSON.parse(doneTravel));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const saveWorking = async () => {
    if (working !== undefined && working !== null) {
      await AsyncStorage.setItem(STATUS_KEY, JSON.stringify(working));
    } else {
      console.log("Invalid value for working", working);
    }
  };

  const loadWorking = async () => {
    try {
      const status = await AsyncStorage.getItem(STATUS_KEY);
      if (status !== null) {
        setWorking(JSON.parse(status));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveToDos = async (toSave) => {
    if (toSave !== undefined && toSave !== null) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } else {
      console.log("Invalid value for toDos", toSave);
    }
  };
  const loadToDos = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        setToDos(JSON.parse(value));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    /* const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { text, working },
    }); */
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, done: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = async (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      {
        text: "No",
      },
      {
        text: "I'm Sure",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
        style: "destructive",
      },
    ]);
    return;
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? "white" : theme.grey,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? theme.grey : "white",
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          // toDos[key].working 는 map함수 내부의 값이고
          // 우측 working은 useState의 값이다.
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <Text>
                <TouchableOpacity
                  onPress={() => toggle(key)}
                  style={styles.toDoBox}
                >
                  {toDos[key].done ? (
                    <Fontisto
                      name="checkbox-active"
                      size={20}
                      color="yellowgreen"
                    />
                  ) : (
                    <Fontisto
                      name="checkbox-passive"
                      size={20}
                      color="rgba(255,255,255,0.5)"
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Text>
                    <Fontisto name="trash" size={20} color={"grey"} />
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.toDoBg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: { color: "white", fontSize: 16, fontWeight: "500" },
  toDoBox: {
    marginRight: 20,
  },
});
