const { select, input, checkbox } = require('@inquirer/prompts') 
const fs = require("fs").promises


let mensagem = "Bem vindo ao app de metas";
let metas 

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile('metas.json', "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async() => {
    const meta = await input({message:"Digite a meta:"})

    if(meta.length == 0) {
        mensagem = 'A meta não pode ser vazia'
    }

    metas.push(
        {value: meta, checked: false}
    )

    mensagem = "Metas cadastradas com sucesso"
}

const listarMetas = async() => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        mensagem = "nenhuma meta seleciona"
        return
    }

  
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

const metasAbertas = async() => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.length == 0) {
        mensagem = "Não existe metas abertas! :"
        return
    }

    await select({
        message: "Metas Abertas" + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async() => {
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })

    const itemADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itemADeletar.length == 0) {
        mensagem = "Nenhum item para deletar"
        return
    }

    itemADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

     mensagem = 'Metas(s) deleta(s) com sucesso!'
    
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    await carregarMetas()
    await salvarMetas()
    while(true) {
        
        mostrarMensagem()
        const opcao = await select({
            message: "Menu >",
            choices:[
                {
                    name:'Cadastrar meta',
                    value: 'cadastrar'
                },
                {
                    name:'listar metas',
                    value:'listar'
                },
                {
                    name:'Metas realizadas',
                    value:'realizadas'
                },
                {
                    name:'Metas abertas',
                    value:'abertas'
                },
                {
                    name:'Deletar metas',
                    value:'deletar'
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
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "realizadas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                return
        } 
    }
}

start()