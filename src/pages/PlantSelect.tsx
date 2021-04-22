import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/core'
import { 
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native'

import { Header } from '../components/Header'
import colors from '../styles/colors'
import fonts from '../styles/fonts'
import { EnviromentButton } from '../components/EnviromentButton'
import api from '../services/api'
import { PlantCardPrimary } from './PlantCardPrimary'
import { Load } from '../components/Load'

interface EnviromentProps {
    key: string;
    title: string;
}

interface PlantsProps {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
      times: number;
      repeat_every: string;
    }
}

export function PlantSelect() {
    const [enviroments, setEnviroments] = useState<EnviromentProps[]>([])
    const [plants, setPlants] = useState<PlantsProps[]>([])
    const [filteredPlants, setFilteredPlants] = useState<PlantsProps[]>([])
    const [enviromentsSelected, setEnviromentsSelected] = useState('all')
    const [loading, setLoading] = useState(true)
    
    const [page, setPage] = useState(1)
    const [loadingMore, setLoadMore] = useState(true)
    const [loadedAll, setLoadedAll] = useState(false)

    function hendleEnviromentSelected(enviroment: string) {
        setEnviromentsSelected(enviroment);

        if(enviroment =='all')
        return setFilteredPlants(plants)

        const filtered = plants.filter(plant =>
            plant.environments.includes(enviroment)
        );

        setFilteredPlants(filtered)
    }

    async function fetchPlants(){
        const { data } = await api
        .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if(!data)
            return setLoading(true)

        if(page > 1) {
            setPlants(oldValue => [...oldValue, ...data])
            setFilteredPlants(oldValue => [...oldValue, ...data])
        }else{
            setPlants(data);
            setFilteredPlants(data)
            
        }
        setLoading(false)
        setLoadMore(false)
    }

    function handleFetchMore(distance: number) {
        if(distance < 1)
            return;

        setLoadMore(true)
        setPage(oldValue => oldValue + 1)
        fetchPlants()
    }

    useEffect(() =>{
        async function fetchEnviroment(){
            const { data } = await api.
            get('plants_environments?_sort=title&_order=asc');
            setEnviroments([
                {
                    key: 'all',
                    title: 'todos',
                },
                ...data
            ]);
        }

        fetchEnviroment()
    }, [])

    useEffect(() =>{
    
        fetchPlants()
    }, [])
    
    if(loading) {
        return <Load/>        
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header/>

                <Text style={styles.title}>
                    Em qual ambiente
                </Text>

                <Text style={styles.subtitle}>
                    você quer colocar sua planta?
                </Text>
            </View>

            <View>
                <FlatList
                    data={enviroments}
                    renderItem={({ item }) => (
                        <EnviromentButton 
                            title={item.title}
                            active={item.key === enviromentsSelected}
                            onPress={() => hendleEnviromentSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View style={styles.plants}>
                    <FlatList 
                        data={filteredPlants}
                        renderItem={({ item }) => (
                            <PlantCardPrimary data={item}></PlantCardPrimary>
                        )}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        onEndReachedThreshold={0.1}
                        onEndReached={({ distanceFromEnd}) =>
                            handleFetchMore(distanceFromEnd)
                        }
                        ListFooterComponent={
                            loadingMore ?
                            <ActivityIndicator color={colors.green} />
                            : <></>
                        }
                    />  
            </View>          
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        paddingHorizontal: 32,
        marginVertical: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    },
    


})