const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id))
    return response.status(400).json({ error: 'Invalid repository ID' });

  return next();
}


app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  // let id = '123';
  let id = uuid();

  if(!isUuid(id))
    return response.status(400).json({ error: 'Invalid repository ID' });

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);
  
  return response.send(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if(!isUuid(id))
    return response.status(400).json({ error: 'Invalid repository ID' });

  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  if(repositoryIndex < 0)
    return response.status(400).json({ error: 'Repository not found' });

  const repository = repositories[repositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[repositoryIndex] = repository;

  return response.send(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  if(repositoryIndex < 0)
    return response.status(400).json({ error: 'Repository not found' });

  repositories.splice(repositoryIndex, 1);  
  
  return response.status(204).send();

  
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  if(repositoryIndex < 0)
    return response.status(400).json({ error: 'Repository not found' });

  const repository = repositories[repositoryIndex];

  repository.likes++;

  repositories[repositoryIndex] = repository;

  return response.send(repository);
});

module.exports = app;
