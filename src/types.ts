//Single entry from API
export type Product = {
    id: number;
    name: string;
    year: number;
    color: number;
    pantone_value: string;
  };
  
//Whole data chunk received from API
 export type FetchedData = {
    page?: number;
    per_page?: number;
    total?: number;
    total_pages?: number;
    data: Product[] | Product;
  };