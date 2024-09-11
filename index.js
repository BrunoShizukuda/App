const { select, input, checkbox } = require('@inquirer/prompts') 

let meta = {
    value: "Tomar 3L de água por dia",
    checked: false,

}

let metas = [meta]

const cadastrarMeta = async() => {
    const meta = await input({message:"Digite a meta:"})

    if(meta.length == 0) {
        console.log('A meta não pode ser vazia')
    }

    metas.push(
        {value: meta, checked: false}
    )
}

const listarMetas = async() => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })
    if(respostas.length == 0) {
        console.log("nenhuma meta seleciona")
        return
    }

    metas.forEach((m) => {
        m.checked = false
    })

    respostas.forEach((respostas) => {
        const meta = metas.find((m) => {
            return m.value == respostas
        })
        meta.checked = true
    })

    console.log('Meta(s) marcadas como concluido')
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        console.log(realizadas)
        return
    }

    await select({
        message: "Metas realizadas",
        choices: [...realizadas]
    })

    
}

const start = async () => {
    while(true) {
        
        const opcao = await select({
            message: "Menu >",
            choices:[
                {
                    name:'Cadastrar meta',
                    value: 'cadastrar'
                },
                {
                    name:'Listar metas',
                    value:'listar'
                },
                {
                    name:'Metas realizadas',
                    value:'realizadas'
                },
                {
                    name:"Sair",
                    value: 'sair'
                }
            ]
        })

        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta()
                break
            case "Listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
            case "sair":
                return
        } 
    }
}

start()