import { Link } from 'react-router-dom';
import { Clock, MapPin, ChefHat } from 'lucide-react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Canteen } from '@/data/mockData';

interface CanteenCardProps {
  canteen: Canteen;
}

export const CanteenCard = ({ canteen }: CanteenCardProps) => {
  const canteenColor = canteen.color as 'gcr' | 'dms' | 'sfc';

  return (
    <Card className="overflow-hidden hover:shadow-elevated transition-all duration-300 group animate-slide-up">
      <CardContent className="p-0">
        {/* Image */}
        <div className="h-56 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br from-${canteenColor} to-${canteenColor}/80`} />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
          
          {/* Canteen Name Overlay */}
          <div className="absolute top-4 left-4">
            <Badge className={`bg-${canteenColor} text-${canteenColor}-foreground`}>
              {canteen.name}
            </Badge>
          </div>

          {/* Food Icon */}
          <div className="absolute bottom-4 right-4 text-white/80 text-5xl">
            🍽️
          </div>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-foreground mb-1">
              {canteen.fullName}
            </h3>
            <p className="text-muted-foreground text-sm">
              {canteen.description}
            </p>
          </div>

          {/* Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{canteen.hours}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{canteen.location}</span>
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <ChefHat className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Specialties</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {canteen.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <Link to={`/canteen/${canteen.id}`}>
            <Button className="w-full group-hover:scale-105 transition-transform duration-200">
              View Menu
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};