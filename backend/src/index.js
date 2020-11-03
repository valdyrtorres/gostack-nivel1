const express = require('express');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json()); // deve vir aqui, devido a linearidade do express

/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 * Obs: O PUT normalmente é utilizado para alterar todos os dados de uma vez
 * Já o PATCH é usado para alterar um dado muito específico, mas tanto faz, não há uma regrar
 * DELETE: Deletar uma informação no back-end
 */

 /*
    Tipos de parâmetros:
    Query Params: Filtros e paginação
    Route Params: Identificar recursos (Atualizar/Deletar)
    Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
 */

const projects = [];

app.get('/projects', (request, response) => {
    const { title } = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    return response.json(results);
});

// Se eu quisesse criar um projeto
app.post('/projects', (request, response) => {
    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner };

    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body; 

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.'});
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.'});
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});



app.listen(3333, () => {
    console.log('🎈Back-end started!');
});