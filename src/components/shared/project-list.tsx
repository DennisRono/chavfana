
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, MapPin, Wheat, Beef, Plus, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProjectDetailModal from './project-detail-modal';
import { updateLastTime } from '@/utils/functions';

interface ProjectsListProps {
  searchQuery?: string;
  apiProjects: {
    active_projects: number,
    count: number,
    next: number,
    previous: number,
    results: any[],
    total_animals: number,
    total_land_under_cultivation: number
  };
  isLoading: boolean;
  error: {}
}

const ProjectsList = ({ searchQuery = '', apiProjects, isLoading, error }: ProjectsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch projects from API
  // const { data: apiProjects, isLoading, error } = useQuery({
  //   queryKey: ['projects'],
  //   queryFn: () => apiService.getProjects(),
  // });

  // Sample projects for demonstration (fallback if API fails)
  const sampleProjects = [
    {
      id: 1,
      name: 'Wheat Field A',
      type: 'plant',
      location: 'North Field',
      status: 'Active',
      lastUpdated: '2 days ago',
      area: '25 acres'
    },
    {
      id: 2,
      name: 'Dairy Cattle Group',
      type: 'animal',
      location: 'Barn 1',
      status: 'Active',
      lastUpdated: '1 day ago',
      count: '45 cattle'
    },
    {
      id: 3,
      name: 'Corn Plantation B',
      type: 'plant',
      location: 'South Field',
      status: 'Planning',
      lastUpdated: '5 days ago',
      area: '30 acres'
    },
    {
      id: 4,
      name: 'Poultry Farm',
      type: 'animal',
      location: 'Coop 2',
      status: 'Active',
      lastUpdated: '3 hours ago',
      count: '200 chickens'
    }
  ];

  const projects = apiProjects || sampleProjects;

  const activeSearchTerm = searchQuery || searchTerm;
  const filteredProjects = apiProjects.results.filter((project: any) =>
    project.name.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
    project.location.city.toLowerCase().includes(activeSearchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openProjectDetail = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectDetail = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Farm Projects</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery || searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-muted-foreground">Loading projects...</p>}
          {error && <p className="text-red-500">Failed to load projects from API. Showing sample data.</p>}

          {apiProjects != undefined ? (
            apiProjects.results.map((project: any) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-muted rounded-lg">
                    {project.type === 'PlantingProject' ? (
                      <Wheat className="h-5 w-5 text-green-600" />
                    ) : (
                      <Beef className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{project.location.city}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{updateLastTime(project.created_at)}</span>
                      </div>
                      {/* <span>{project.type === 'PlantingProject' ? project.area_size : project.count}</span> */}
                      <span>{project.type === 'PlantingProject' ?
                        project.total_area_size + ' acres' :
                        project.total_project_animal + ' animals'} </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openProjectDetail(project)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            )
            )) : (
            <p>You have no ongoing projects</p>
          )}
        </CardContent>
      </Card>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeProjectDetail}
      />
    </>
  );
};

export default ProjectsList;
