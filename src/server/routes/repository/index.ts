import { Router } from '@packages/framework';
import { repositoryController } from '@controllers/repository';
import { repositoryUpdateLimiter } from '@middlewares';

export const repositoryRouter = Router();

repositoryRouter.post('/', repositoryController.addRepository);
repositoryRouter.get('/', repositoryController.getUserRepositories);
repositoryRouter.get('/:id', repositoryController.getRepository);
repositoryRouter.put('/:id/update', repositoryUpdateLimiter, repositoryController.updateRepository);
repositoryRouter.delete('/:id', repositoryController.deleteRepository); 