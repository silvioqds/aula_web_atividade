import React, { useState } from 'react'
import Head from "next/head"

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import MyInput from '../../components/input'
import styles from './styles.module.css'
import { userService } from '@/services/user.service'
import { authService } from '@/services/auth.service'
import { User } from '@/model/user'
import SelectComponent from '@/components/select'
import { roleservice } from '@/services/role.service'
import MultiSelectRoles from '@/components/select'
import Select from 'react-select/base';

export default function UserPage() {

    const router = useRouter()
    const params = useParams()

    const [title, setTitle] = React.useState('Novo Usuário')

    const [id, setId] = React.useState(0)
    const [name, setName] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [passConfirm, setPassConfirm] = React.useState('')
    const [options, setOptionsRole] = useState<{ value: string; label: string; }[]>([]);    
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [labelRoleSelecionada, setLabelRoleSelecionada] = useState('')

    const handleRoleChange = (value: any) => {
        const include = selectedRoles.includes(value);
        let array = [...selectedRoles]; // Crie uma cópia do array original
      
        if (include) 
          array = array.filter(v => v !== value);
        else
          array.push(value);
      
        setSelectedRoles(array);
      };

    React.useEffect(() => {
        const user = authService.getLoggedUser()
        if (!user) router.replace('/login')
        
        roleservice.getList().then(roleList => {
            const option = roleList.map(role => ({
                value: role.name,
                label: role.name
            }));
            setOptionsRole(option);
        });                
    }, []);

    React.useEffect(() => {
        if (params && params.id) {
            if (Number(params.id) > 0) {
                setTitle('Edição de Usuário')
                setId(Number(params.id))
                setLabelRoleSelecionada('Perfils do usuário')
            }
        }
    }, [params])

    React.useEffect(() => {
        if (id > 0) {
            userService.get(id).then(user => {
                setName(user.name)
                setUsername(user.username)      
                setSelectedRoles(user.roles)                                 
            }).catch(treat)
        }
    }, [id])

    function treat(error: any) {
        if (authService.isUnauthorized(error)) {
            router.replace('/login')
        } else {
            alert(`${username}: ${error.message}`)
        }
    }

    async function save() {
        if (!name || name.trim() === '') {
            alert('Nome é obrigatório')
            return
        }

        if (id === 0 || password.trim() !== '') {
            if (!password || password.trim() === '') {
                alert('Senha é obrigatória')
                return
            }
            if (password !== passConfirm) {
                alert('A Senha não confere')
                return
            }
        }

        try {
            if (id > 0) { // editar um usuário
                let body = { name, username, roles : selectedRoles} as User
                
                if (password && password.trim() !== '') {
                    body = { ...body, password }
                }
                await userService.update(id, body)
                router.back()

            } else { // Criar um novo
                if (!username || username.trim() === '') {
                    alert('Login é obrigatório')
                    return
                }
        
                await userService.create({ name, username, password, roles : selectedRoles })
                router.back()
            }
        } catch (error: any) {
            treat(error)
        }
    }

    return (
        <div className={styles.loginPage}>
            <Head> <title>Cadastro de Usuário</title> </Head>

            <main className={styles.main}>
                <h2>{title}</h2>

                <div className={styles.inputs}>
                    <MyInput
                        label='Nome'
                        value={name}
                        onChange={event => setName(event.target.value)}
                    />
                    <MyInput
                        label='Login'
                        value={username}
                        readOnly={id > 0}
                        onChange={event => setUsername(event.target.value)}
                    />                    

                    <MyInput
                        label='Senha'
                        type='password'
                        onChange={event => setPassword(event.target.value)}
                    />
                    <MyInput
                        label='Confirmar Senha'
                        type='password'
                        onChange={event => setPassConfirm(event.target.value)}
                    />                 

                    <MultiSelectRoles
                        options={options}
                        selectedRoles={selectedRoles}    
                        onChange={event => handleRoleChange(event.target.value)}   
                        value='Perfil' 
                    />                
                    <p className={styles.roleSelected}>{labelRoleSelecionada}: {selectedRoles ? selectedRoles.join(', ') : selectedRoles}</p>
                </div>

                <button className={styles.button} onClick={save}>Salvar</button>
            </main>
        </div>
    )
}