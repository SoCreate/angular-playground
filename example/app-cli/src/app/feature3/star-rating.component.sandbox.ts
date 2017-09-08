import { sandboxOf } from 'angular-playground';
import { StarRatingComponent } from './star-rating.component';
export default sandboxOf(StarRatingComponent)
  .add('3 stars', {template: '<ex-star-rating [stars]="3"></ex-star-rating>'});
