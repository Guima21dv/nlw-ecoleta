import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { Link, useHistory } from 'react-router-dom'
import api from '../../services/api'
import axios from 'axios'
import { FiArrowLeft } from 'react-icons/fi'
import { LeafletMouseEvent } from 'leaflet'
import Dropzone from '../../components/Dropzone'

import './styles.css'
import logo from '../../assets/logo.svg'
import Item from '../../interfaces/Item'
import UF from '../../interfaces/UF'
import City from '../../interfaces/City'
import IBGEUFResponse from '../../interfaces/IBGELocalidadesResponse'
import IBGEMunicipioResponse from '../../interfaces/IBGELocalidadesResponse'

const CreatePoint = () => {
    //SEMPRE QUE CRIAR UM ESTADO PARA UM ARRAY OU UM OBJETO É PRECISO
    //INFORMAR O TIPO DA VARIÁVEL
    const [items, setItems] = useState<Array<Item>>([])

    const [ufs, setUfs] = useState<Array<UF>>([])
    const [cities, setCities] = useState<Array<City>>([])

    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })

    const [selectedItems, setSelectedItems] = useState<Array<number>>([])

    const [selectedFile, setSelectedFile] = useState<File>()

    const history = useHistory()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInitialPosition([latitude, longitude])
            setSelectedPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        axios.get<Array<IBGEUFResponse>>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                setUfs(response.data.map(uf => {
                    return {
                        name: uf.nome,
                        initials: uf.sigla
                    }
                }))
            })
    }, [])

    useEffect(() => {
        if (selectedUf === '0') {
            return
        }

        axios.get<Array<IBGEMunicipioResponse>>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                setCities(response.data.map(city => {
                    return {
                        name: city.nome
                    }
                }))
            })
    }, [selectedUf])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value
        setSelectedUf(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value
        setSelectedCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    function handleSelectItem(itemId: number) {
        const alreadySelected = selectedItems.includes(itemId)
        if (alreadySelected) {
            const filteredItems = selectedItems.filter(item => item !== itemId)
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([
                ...selectedItems,
                itemId
            ])
        }

    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()



        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = new FormData()

        data.append('name',name)
        data.append('email',email)
        data.append('whatsapp',whatsapp)
        data.append('uf',uf)
        data.append('city',city)
        data.append('latitude',String(latitude))
        data.append('longitude',String(longitude))
        data.append('items',items.join(','))

        if(selectedFile){
            data.append('image', selectedFile)
        }


        // const data = {
        //     name,
        //     email,
        //     whatsapp,
        //     uf,
        //     city,
        //     latitude,
        //     longitude,
        //     items
        // }

        await api.post('points', data)
        alert("Ponto de coleta criado")

        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft></FiArrowLeft>Voltar para home
        </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do<br /> ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile}></Dropzone>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <Map
                        center={initialPosition}
                        zoom={15}
                        onClick={handleMapClick}>
                        <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={selectedPosition}></Marker>
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado/UF</label>
                            <select
                                value={selectedUf}
                                name="uf"
                                id="uf"
                                onChange={handleSelectUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option
                                        key={uf.initials}
                                        value={uf.initials}
                                    >{uf.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>

                            <select
                                value={selectedCity}
                                name="city"
                                id="city"
                                onChange={handleSelectCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option
                                        key={city.name}
                                        value={city.name}
                                    >{city.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li className={selectedItems.includes(item.id) ? 'selected' : ''} key={item.id} onClick={() => handleSelectItem(item.id)}>
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">Cadastar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint