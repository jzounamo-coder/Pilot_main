import { useState, useEffect } from 'react';

export interface PboItem {
  id: string;
  nomPbo: string;
  nbPbo: number;
  portsDispos: number;
  portsOccupes: number;
  localisation: string;
  dateMaj: string;
  arrondissement: string;
  codePbo?: string;
  idPbo?: string;
  pboNumberTotalPort?: any;
  pboNumberFreePort?: any;
  oltPort1?: any;
  pdz?: any;
  ville?: string;
  lat?: any;
  lng?: any;
  clients?: any[];
}

export function usePboList() {
  const [pbos, setPbos] = useState<PboItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFull, setIsFull] = useState(false);

  const [selectedCity, setSelectedCity] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchCityQuery, setSearchCityQuery] = useState(''); 
  const [searchIdQuery, setSearchIdQuery] = useState('');

  const cities = ['Tous', ...new Set(pbos.map(pbo => pbo.localisation))];

  const filteredCitiesInModal = cities.filter(city => 
    city.toLowerCase().includes(searchCityQuery.toLowerCase())
  );

  const fetchPbos = async (pageNumber: number) => {
    if (loading || isFull) return;

    try {
      if (pageNumber === 1) setLoading(true);
      
      const response = await fetch(`https://control-api-dev.speedpro.cg/api/v1/ftth/pbo`);
      const json = await response.json();
      
      const apiData = json.data || (Array.isArray(json) ? json : []); 

      if (apiData.length === 0) {
        setIsFull(true);
        return;
      }

      const formattedData = apiData.map((item: any) => {
        const total = parseInt(item.pboNumberTotalPort) || 16;
        const libres = parseInt(item.pboNumberFreePort) || 0;
        const occupes = total - libres; 

        return {
          id: item._id, 
          nomPbo: item.idPbo || item.codePbo || 'Sans ID',
          nbPbo: total, 
          portsDispos: libres,
          portsOccupes: occupes, 
          localisation: item.ville || 'Congo', 
          dateMaj: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '17/03/2026',
          arrondissement: item.arrondissement || item.district || 'Non renseigné',
          codePbo: item.codePbo,
          idPbo: item.idPbo, 
          pboNumberTotalPort: item.pboNumberTotalPort,
          pboNumberFreePort: item.pboNumberFreePort,
          oltPort1: item.oltPort1,
          pdz: item.pdz,
          ville: item.ville,
          lat: item.lat,
          lng: item.lng,
          clients: item.clients || []
        };
      });

      setPbos(prev => pageNumber === 1 ? formattedData : [...prev, ...formattedData]);
    } catch (error) {
      console.error("Erreur API PBO:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPbos(1);
  }, []);

  const loadMore = () => {
    if (!loading && !isFull) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPbos(nextPage);
    }
  };

  const filteredPbos = pbos.filter(item => {
    const matchesCity = selectedCity === 'Tous' || item.localisation === selectedCity;
    const query = searchIdQuery.toLowerCase().trim();
    const matchesId = 
      item.nomPbo.toLowerCase().includes(query) ||
      (item.idPbo && item.idPbo.toLowerCase().includes(query)) ||
      (item.codePbo && item.codePbo.toLowerCase().includes(query));

    return matchesCity && matchesId;
  });

  return {
    loading,
    page,
    selectedCity,
    setSelectedCity,
    isModalOpen,
    setIsModalOpen,
    searchCityQuery,
    setSearchCityQuery,
    searchIdQuery,
    setSearchIdQuery,
    filteredCitiesInModal,
    filteredPbos,
    loadMore
  };
}