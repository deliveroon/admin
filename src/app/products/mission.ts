import { Article } from './article';
import { Statut } from './statut';

export class Mission{
    id: number;
    name: string;
    gps: string;
    articles: Article[];
    statut: Statut;
    total: number;
    livreur: number;
    color: string = 'danger';

}