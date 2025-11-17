# Farm Management Actions Documentation

documentation for all Redux Toolkit async actions used in the Farm Management application. Each action corresponds to a backend API endpoint and follows Redux Toolkit patterns with proper error handling.

## Authentication

### File: `auth.ts`

#### `registerUser`

Register a new user account.

**Endpoint:** `POST /api/user/register/`

**Payload:**

```json
{
  "email": "user@example.com",
  "password1": "password123",
  "password2": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890"
}
```

**Returns:**

```json
{
  "message": "Registration successful"
}
```

#### `loginUser`

Authenticate user and receive JWT tokens.

**Endpoint:** `POST /api/user/login/`

**Payload:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

OR

```json
{
  "phone_number": "+1234567890",
  "password": "password123"
}
```

**Returns:**

```json
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "id": "user_uuid",
  "role": "user_role",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### `verifyToken`

Verify if a JWT token is valid.

**Endpoint:** `POST /api/token/verify/`

**Payload:**

```json
{
  "token": "jwt_token_string"
}
```

**Returns:**

```json
{
  "valid": true
}
```

#### `sendOTP`

Send OTP to phone number for verification.

**Endpoint:** `POST /api/user/send-sms/`

**Payload:**

```json
{
  "phone_number": "+1234567890"
}
```

**Returns:**

```json
{
  "message": "OTP sent successfully"
}
```

#### `verifyOTP`

Verify OTP code sent to phone.

**Endpoint:** `POST /api/user/verify-phone/`

**Payload:**

```json
{
  "phone_number": "+1234567890",
  "otp": "123456"
}
```

**Returns:**

```json
{
  "message": "Phone verified successfully"
}
```

#### `initiatePasswordReset`

Initiate password reset by sending OTP.

**Endpoint:** `POST /api/user/password/initiate-password-reset/`

**Payload:**

```json
{
  "phone_number": "+1234567890"
}
```

**Returns:**

```json
{
  "message": "Password reset OTP sent"
}
```

#### `resetPasswordWithOTP`

Reset password using OTP received.

**Endpoint:** `POST /api/user/password/create-password-from-otp/`

**Payload:**

```json
{
  "phone_number": "+1234567890",
  "otp": "123456",
  "new_password1": "newpassword123",
  "new_password2": "newpassword123"
}
```

**Returns:**

```json
{
  "message": "Password reset successful"
}
```

## User Management

### File: `user.ts`

#### `getUserDetails`

Get authenticated user's profile information.

**Endpoint:** `GET /api/user/`

**Headers Required:** `Authorization: Bearer {token}`

**Returns:**

```json
{
  "id": "user_uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "role": "farmer",
  "is_verified": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### `updateUserProfile`

Update user profile information.

**Endpoint:** `PATCH /api/user/`

**Payload:**

```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone_number": "+1234567890"
}
```

**Returns:** Updated user object (same structure as getUserDetails)

## Address Management

### File: `address.ts`

#### `getAllAddresses`

Get all addresses for authenticated user (paginated).

**Endpoint:** `GET /api/user/address/`

**Query Parameters:**

- `page`: Page number (optional)

**Returns:**

```json
{
  "count": 5,
  "next": "http://api.example.org/accounts/?page=2",
  "previous": null,
  "results": [
    {
      "id": "address_uuid",
      "user": "user_uuid",
      "country": "US",
      "city": "New York",
      "street_address": "123 Main St",
      "apartment_address": "Apt 4B",
      "postal_code": "10001",
      "address_type": "P",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `getAddressById`

Get single address by ID.

**Endpoint:** `GET /api/user/address/{id}/`

**Returns:** Single address object (same structure as in getAllAddresses results)

#### `createPrimaryAddress`

Create primary address for user.

**Endpoint:** `POST /api/user/address/primary`

**Payload:**

```json
{
  "country": "US",
  "city": "New York",
  "street_address": "123 Main St",
  "apartment_address": "Apt 4B",
  "postal_code": "10001"
}
```

**Returns:** Created address object

#### `createSecondaryAddress`

Create secondary address for user.

**Endpoint:** `POST /api/user/address/secondary`

**Payload:**

```json
{
  "country": "US",
  "city": "Los Angeles",
  "street_address": "456 Oak Ave",
  "apartment_address": "Unit 2",
  "postal_code": "90001"
}
```

**Returns:** Created address object

## Project Management

### File: `project.ts`

#### `getAllProjects`

Get all projects for authenticated user (paginated).

**Endpoint:** `GET /api/projects/`

**Query Parameters:**

- `page`: Page number (optional)

**Returns:**

```json
{
  "count": 10,
  "next": "http://api.example.org/accounts/?page=2",
  "previous": null,
  "results": [
    {
      "id": "project_uuid",
      "name": "North Field Project",
      "created_date": "2024-01-01",
      "user": "user_uuid",
      "soil": { "id": "soil_uuid", "type": "loam", "ph": 6.5 },
      "location": { "latitude": 40.7128, "longitude": -74.006 },
      "status": "active",
      "type": "planting",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `getProjectById`

Get single project by ID.

**Endpoint:** `GET /api/projects/{id}/`

**Returns:** Single project object (polymorphic - can be planting or animal keeping project)

#### `createProject`

Create new project.

**Endpoint:** `POST /api/projects/`

**Payload (Planting Project):**

```json
{
  "name": "South Field Project",
  "created_date": "2024-01-15",
  "user": "user_uuid",
  "location": { "latitude": 40.7128, "longitude": -74.006 },
  "status": "active",
  "type": "planting",
  "soil": {
    "type": "sandy",
    "ph": 6.8,
    "nitrogen": 20.5,
    "phosphorus": 15.3,
    "potassium": 18.2
  },
  "weather": {
    "temperature": 22.5,
    "humidity": 65,
    "precipitation": 10.2,
    "wind_speed": 5.5,
    "solar_radiation": 850.0
  }
}
```

**Payload (Animal Keeping Project):**

```json
{
  "name": "Cattle Ranch Project",
  "created_date": "2024-01-15",
  "user": "user_uuid",
  "location": { "latitude": 40.7128, "longitude": -74.006 },
  "status": "active",
  "type": "animal_keeping",
  "is_active": true
}
```

**Returns:** Created project object

#### `updateProject`

Update existing project.

**Endpoint:** `PUT /api/projects/{id}/`

**Payload:** Same structure as createProject

**Returns:** Updated project object

#### `deleteProject`

Delete project.

**Endpoint:** `DELETE /api/projects/{id}/`

**Returns:** 204 No Content

#### `searchProjects`

Search/filter projects.

**Endpoint:** `GET /api/projects/filter`

**Query Parameters:**

- `search`: Search term (optional)
- `page`: Page number (optional)

**Returns:** Paginated list of projects matching search criteria

## Farm Management

### File: `farm.ts`

#### `getAllFarms`

Get all farms for authenticated user (paginated).

**Endpoint:** `GET /api/farms/`

**Query Parameters:**

- `page`: Page number (optional)

**Returns:**

```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "farm_uuid",
      "name": "Green Valley Farm",
      "size": 50.5,
      "unit": "hectare",
      "location": { "latitude": 40.7128, "longitude": -74.006 },
      "user": "user_uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `getFarmById`

Get single farm by ID.

**Endpoint:** `GET /api/farms/{id}/`

**Returns:** Single farm object

#### `createFarm`

Create new farm.

**Endpoint:** `POST /api/farms/`

**Payload:**

```json
{
  "name": "Sunny Acres Farm",
  "size": 75.0,
  "unit": "hectare",
  "location": { "latitude": 40.7128, "longitude": -74.006 }
}
```

**Returns:** Created farm object

#### `updateFarm`

Update existing farm.

**Endpoint:** `PUT /api/farms/{id}/`

**Payload:** Same structure as createFarm

**Returns:** Updated farm object

#### `deleteFarm`

Delete farm.

**Endpoint:** `DELETE /api/farms/{id}/`

**Returns:** 204 No Content

## Plot Management

### File: `plot.ts`

#### `getAllPlots`

Get all plots for a specific farm (paginated).

**Endpoint:** `GET /api/farms/{farmId}/plots/`

**Query Parameters:**

- `page`: Page number (optional)

**Returns:**

```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "plot_uuid",
      "name": "North Plot",
      "size": 5.5,
      "unit": "hectare",
      "farm": "farm_uuid",
      "soil_type": "loam",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `getPlotById`

Get single plot by ID.

**Endpoint:** `GET /api/farms/{farmId}/plots/{id}/`

**Returns:** Single plot object

#### `createPlot`

Create new plot in farm.

**Endpoint:** `POST /api/farms/{farmId}/plots/`

**Payload:**

```json
{
  "name": "East Plot",
  "size": 3.2,
  "unit": "hectare",
  "soil_type": "sandy"
}
```

**Returns:** Created plot object

#### `updatePlot`

Update existing plot.

**Endpoint:** `PUT /api/farms/{farmId}/plots/{id}/`

**Payload:** Same structure as createPlot

**Returns:** Updated plot object

#### `deletePlot`

Delete plot.

**Endpoint:** `DELETE /api/farms/{farmId}/plots/{id}/`

**Returns:** 204 No Content

## Finance Management

### File: `finance.ts`

#### `getAllFinances`

Get all finance records (paginated).

**Endpoint:** `GET /api/finances/`

**Query Parameters:**

- `page`: Page number (optional)

**Returns:**

```json
{
  "count": 20,
  "next": "http://api.example.org/accounts/?page=2",
  "previous": null,
  "results": [
    {
      "id": "finance_uuid",
      "project": "project_uuid",
      "date": "2024-01-15",
      "kind": "expense",
      "inventory_item": "item_uuid",
      "transactions": [
        {
          "id": "transaction_uuid",
          "description": "Seeds purchase",
          "amount": "250.00",
          "category": "supplies"
        }
      ],
      "total_amount": "250.00",
      "created_at": "2024-01-15T00:00:00Z",
      "updated_at": "2024-01-15T00:00:00Z"
    }
  ]
}
```

#### `getFinanceById`

Get single finance record by ID.

**Endpoint:** `GET /api/finances/{id}/`

**Returns:** Single finance object

#### `createFinance`

Create new finance record.

**Endpoint:** `POST /api/finances/`

**Payload:**

```json
{
  "project": "project_uuid",
  "date": "2024-01-20",
  "kind": "income",
  "inventory_item": "item_uuid",
  "transactions": [
    {
      "description": "Crop sale",
      "amount": "1500.00",
      "category": "sales"
    }
  ]
}
```

**Returns:** Created finance object

#### `updateFinance`

Update existing finance record.

**Endpoint:** `PUT /api/finances/{id}/`

**Payload:** Same structure as createFinance

**Returns:** Updated finance object

#### `partialUpdateFinance`

Partially update finance record.

**Endpoint:** `PATCH /api/finances/{id}/`

**Payload:** Any subset of finance fields

**Returns:** Updated finance object

#### `deleteFinance`

Delete finance record.

**Endpoint:** `DELETE /api/finances/{id}/`

**Returns:** 204 No Content

## Soil Management

### File: `soil.ts`

#### `getAllSoils`

Get all soil records (paginated).

**Endpoint:** `GET /api/soil/`

**Query Parameters:**

- `page`: Page number (optional)

**Returns:**

```json
{
  "count": 8,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "soil_uuid",
      "type": "loam",
      "ph": 6.5,
      "nitrogen": 25.5,
      "phosphorus": 18.3,
      "potassium": 20.1,
      "organic_matter": 4.5,
      "moisture": 35.0,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `getSoilById`

Get single soil record by ID.

**Endpoint:** `GET /api/soil/{id}/`

**Returns:** Single soil object

#### `createSoil`

Create new soil record.

**Endpoint:** `POST /api/soil/`

**Payload:**

```json
{
  "type": "sandy",
  "ph": 6.8,
  "nitrogen": 20.0,
  "phosphorus": 15.5,
  "potassium": 18.0,
  "organic_matter": 3.2,
  "moisture": 28.5
}
```

**Returns:** Created soil object

#### `updateSoil`

Update existing soil record.

**Endpoint:** `PUT /api/soil/{id}/`

**Payload:** Same structure as createSoil

**Returns:** Updated soil object

#### `partialUpdateSoil`

Partially update soil record.

**Endpoint:** `PATCH /api/soil/{id}/`

**Payload:** Any subset of soil fields

**Returns:** Updated soil object

#### `deleteSoil`

Delete soil record.

**Endpoint:** `DELETE /api/soil/{id}/`

**Returns:** 204 No Content

## Planting Events

### File: `planting-event.ts`

#### `getAllPlantingEvents`

Get all planting events for a project.

**Endpoint:** `GET /api/projects/{projectId}/planting-events/`

**Returns:**

```json
[
  {
    "id": "planting_event_uuid",
    "project": "project_uuid",
    "species": [
      {
        "id": "species_uuid",
        "name": "Tomato",
        "variety": "Roma",
        "planting_date": "2024-03-15",
        "expected_harvest_date": "2024-07-15"
      }
    ],
    "plot": "plot_uuid",
    "planting_date": "2024-03-15",
    "notes": "Planted in rows",
    "created_at": "2024-03-15T00:00:00Z"
  }
]
```

#### `getPlantingEventById`

Get single planting event by ID.

**Endpoint:** `GET /api/projects/{projectId}/planting-events/{plantingEventId}/`

**Returns:** Single planting event object

#### `createPlantingEvent`

Create new planting event.

**Endpoint:** `POST /api/projects/{projectId}/planting-events/`

**Payload:**

```json
{
  "plot": "plot_uuid",
  "planting_date": "2024-04-01",
  "notes": "Spring planting season",
  "species": [
    {
      "name": "Corn",
      "variety": "Sweet",
      "expected_harvest_date": "2024-08-01"
    }
  ]
}
```

**Returns:** Created planting event object

#### `updatePlantingEvent`

Update existing planting event.

**Endpoint:** `PUT /api/projects/{projectId}/planting-events/{plantingEventId}/`

**Payload:** Same structure as createPlantingEvent

**Returns:** Updated planting event object

#### `deletePlantingEvent`

Delete planting event.

**Endpoint:** `DELETE /api/projects/{projectId}/planting-events/{plantingEventId}/`

**Returns:** 204 No Content

## Species Management

### File: `species.ts`

#### `getAllSpecies`

Get all species for a planting event.

**Endpoint:** `GET /api/project/planting-event/{plantingEventId}/species`

**Returns:**

```json
[
  {
    "id": "species_uuid",
    "name": "Wheat",
    "variety": "Winter Wheat",
    "planting_event": "planting_event_uuid",
    "planting_date": "2024-10-15",
    "expected_harvest_date": "2025-06-15",
    "actual_harvest_date": null,
    "yield_estimate": 4500.0,
    "yield_actual": null,
    "notes": "Requires cold stratification"
  }
]
```

#### `getSpeciesById`

Get single species by ID.

**Endpoint:** `GET /api/project/planting-event/{plantingEventId}/species/{speciesId}`

**Returns:** Single species object

#### `createSpecies`

Create new species for planting event.

**Endpoint:** `POST /api/project/planting-event/{plantingEventId}/species`

**Payload:**

```json
{
  "name": "Barley",
  "variety": "Spring Barley",
  "planting_date": "2024-03-20",
  "expected_harvest_date": "2024-08-20",
  "yield_estimate": 3500.0,
  "notes": "Good for beer production"
}
```

**Returns:** Created species object

#### `updateSpecies`

Update existing species.

**Endpoint:** `PUT /api/project/planting-event/{plantingEventId}/species/{speciesId}`

**Payload:** Same structure as createSpecies

**Returns:** Updated species object

#### `deleteSpecies`

Delete species.

**Endpoint:** `DELETE /api/project/planting-event/{plantingEventId}/species/{speciesId}`

**Returns:** 204 No Content

## Animal Groups

### File: `animal-group.ts`

#### `getAllAnimalGroups`

Get all animal groups for a project.

**Endpoint:** `GET /api/projects/{projectId}/animal-groups/`

**Returns:**

```json
[
  {
    "id": "group_uuid",
    "type": "livestock",
    "group_name": "Dairy Herd A",
    "project": "project_uuid",
    "housing": "barn",
    "pack": {
      "id": "animal_uuid",
      "breed": "Holstein",
      "name": "Cattle Group",
      "gender": "MIXED",
      "count": 25
    },
    "group_created_date": "2024-01-01"
  }
]
```

#### `getAnimalGroupById`

Get single animal group by ID.

**Endpoint:** `GET /api/projects/{projectId}/animal-groups/{groupId}/`

**Returns:** Single animal group object (polymorphic)

#### `createAnimalGroup`

Create new animal group.

**Endpoint:** `POST /api/projects/{projectId}/animal-groups/`

**Payload:**

```json
{
  "type": "poultry",
  "group_name": "Chicken Coop 1",
  "housing": "coop",
  "pack": {
    "breed": "Rhode Island Red",
    "name": "Layer Hens",
    "gender": "FEMALE",
    "count": 50
  },
  "group_created_date": "2024-02-01"
}
```

**Returns:** Created animal group object

#### `updateAnimalGroup`

Update existing animal group.

**Endpoint:** `PUT /api/projects/{projectId}/animal-groups/{groupId}/`

**Payload:** Same structure as createAnimalGroup

**Returns:** Updated animal group object

#### `deleteAnimalGroup`

Delete animal group.

**Endpoint:** `DELETE /api/projects/{projectId}/animal-groups/{groupId}/`

**Returns:** 204 No Content

## Animal Feeds

### File: `animal-feeds.ts`

#### `getAllAnimalFeeds`

Get all feeding records for an animal.

**Endpoint:** `GET /api/project/animal-group/animal/{animalId}/feeds`

**Returns:**

```json
[
  {
    "id": "feed_uuid",
    "animal": "animal_uuid",
    "date": "2024-01-15",
    "name": "Hay",
    "amount": 5.5,
    "unit": "kilogram",
    "nutrients": {
      "protein": 12.5,
      "carbohydrates": 45.0,
      "fat": 2.5,
      "fiber": 30.0
    }
  }
]
```

#### `getAnimalFeedById`

Get single feeding record by ID.

**Endpoint:** `GET /api/project/animal-group/animal/{animalId}/feeds/{feedId}`

**Returns:** Single feed record object

#### `createAnimalFeed`

Create new feeding record.

**Endpoint:** `POST /api/project/animal-group/animal/{animalId}/feeds`

**Payload:**

```json
{
  "date": "2024-01-20",
  "name": "Grain Mix",
  "amount": 3.0,
  "unit": "kilogram",
  "nutrients": {
    "protein": 15.0,
    "carbohydrates": 60.0,
    "fat": 5.0,
    "fiber": 10.0
  }
}
```

**Returns:** Created feed record object

#### `updateAnimalFeed`

Update existing feeding record.

**Endpoint:** `PUT /api/project/animal-group/animal/{animalId}/feeds/{feedId}`

**Payload:** Same structure as createAnimalFeed

**Returns:** Updated feed record object

#### `deleteAnimalFeed`

Delete feeding record.

**Endpoint:** `DELETE /api/project/animal-group/animal/{animalId}/feeds/{feedId}`

**Returns:** 204 No Content

## Animal Diseases

### File: `animal-disease.ts`

#### `getAllAnimalDiseases`

Get all disease records for an animal.

**Endpoint:** `GET /api/project/animal-group/animal/{animalId}/diseases`

**Returns:**

```json
[
  {
    "id": "disease_uuid",
    "name": "Foot Rot",
    "date": "2024-01-10",
    "treatments": [
      {
        "id": "treatment_uuid",
        "treatment": "Antibiotic injection",
        "date": "2024-01-10",
        "notes": "Applied 5ml dose"
      }
    ],
    "animal": "animal_uuid"
  }
]
```

#### `getAnimalDiseaseById`

Get single disease record by ID.

**Endpoint:** `GET /api/project/animal-group/animal/{animalId}/diseases/{diseaseId}`

**Returns:** Single disease record object

#### `createAnimalDisease`

Create new disease record.

**Endpoint:** `POST /api/project/animal-group/animal/{animalId}/diseases`

**Payload:**

```json
{
  "name": "Respiratory Infection",
  "date": "2024-02-01",
  "treatments": []
}
```

**Returns:** Created disease record object

#### `updateAnimalDisease`

Update existing disease record.

**Endpoint:** `PUT /api/project/animal-group/animal/{animalId}/diseases/{diseaseId}`

**Payload:** Same structure as createAnimalDisease

**Returns:** Updated disease record object

#### `deleteAnimalDisease`

Delete disease record.

**Endpoint:** `DELETE /api/project/animal-group/animal/{animalId}/diseases/{diseaseId}`

**Returns:** 204 No Content

## Animal Disease Management

### File: `animal-disease-management.ts`

#### `getAllDiseaseTreatments`

Get all treatments for a specific disease.

**Endpoint:** `GET /api/project/animal-group/animal/{animalId}/diseases/{diseaseId}/treatments`

**Returns:**

```json
[
  {
    "id": "treatment_uuid",
    "disease": "disease_uuid",
    "treatment": "Penicillin injection",
    "date": "2024-01-10",
    "dosage": "5ml",
    "notes": "Repeat in 3 days",
    "created_at": "2024-01-10T00:00:00Z"
  }
]
```

#### `getDiseaseTreatmentById`

Get single treatment record by ID.

**Endpoint:** `GET /api/project/animal-group/animal/{animalId}/diseases/{diseaseId}/treatments/{treatmentId}`

**Returns:** Single treatment record object

#### `createDiseaseTreatment`

Create new treatment record.

**Endpoint:** `POST /api/project/animal-group/animal/{animalId}/diseases/{diseaseId}/treatments`

**Payload:**

```json
{
  "treatment": "Vaccine booster",
  "date": "2024-02-05",
  "dosage": "2ml",
  "notes": "Annual vaccination"
}
```

**Returns:** Created treatment record object

#### `updateDiseaseTreatment`

Update existing treatment record.

**Endpoint:** `PUT /api/project/animal-group/animal/{animalId}/diseases/{diseaseId}/treatments/{treatmentId}`

**Payload:** Same structure as createDiseaseTreatment

**Returns:** Updated treatment record object

#### `deleteDiseaseTreatment`

Delete treatment record.

**Endpoint:** `DELETE /api/project/animal-group/animal/{animalId}/diseases/{diseaseId}/treatments/{treatmentId}`

**Returns:** 204 No Content

## Animal Harvest

### File: `animal-harvest.ts`

#### `getAllAnimalHarvests`

Get all harvest records for an animal.

**Endpoint:** `GET /api/project/animal-group/animal/{animalId}/harvests`

**Returns:**

```json
[
  {
    "id": "harvest_uuid",
    "animal": "animal_uuid",
    "date": "2024-01-15",
    "product": "milk",
    "quantity": 25.5,
    "unit": "litre",
    "quality_grade": "A",
    "notes": "Morning collection"
  }
]
```

#### `getAnimalHarvestById`

Get single harvest record by ID.

**Endpoint:** `GET /api/project/animal-group/animal/{animalId}/harvests/{harvestId}`

**Returns:** Single harvest record object

#### `createAnimalHarvest`

Create new harvest record.

**Endpoint:** `POST /api/project/animal-group/animal/{animalId}/harvests`

**Payload:**

```json
{
  "date": "2024-01-20",
  "product": "eggs",
  "quantity": 12,
  "unit": "kilogram",
  "quality_grade": "AA",
  "notes": "From free-range hens"
}
```

**Returns:** Created harvest record object

#### `updateAnimalHarvest`

Update existing harvest record.

**Endpoint:** `PUT /api/project/animal-group/animal/{animalId}/harvests/{harvestId}`

**Payload:** Same structure as createAnimalHarvest

**Returns:** Updated harvest record object

#### `deleteAnimalHarvest`

Delete harvest record.

**Endpoint:** `DELETE /api/project/animal-group/animal/{animalId}/harvests/{harvestId}`

**Returns:** 204 No Content

## Animal Processing

### File: `animal-process.ts`

#### `getAllAnimalProcesses`

Get all processing records for an animal.

**Endpoint:** `GET /api/project/animal-group/animal/{animalId}/processes`

**Returns:**

```json
[
  {
    "id": "process_uuid",
    "animal": "animal_uuid",
    "type": "butchering",
    "date": "2024-01-15",
    "processor": "Local Butcher Co",
    "products": [
      {
        "name": "Beef Cuts",
        "quantity": 250,
        "unit": "kilogram"
      }
    ],
    "cost": "500.00",
    "notes": "Prime quality cuts"
  }
]
```

#### `getAnimalProcessById`

Get single processing record by ID.

**Endpoint:** `GET /api/project/animal-group/animal/{animalId}/processes/{processId}`

**Returns:** Single processing record object

#### `createAnimalProcess`

Create new processing record.

**Endpoint:** `POST /api/project/animal-group/animal/{animalId}/processes`

**Payload:**

```json
{
  "type": "milking",
  "date": "2024-01-20",
  "processor": "Farm Staff",
  "products": [
    {
      "name": "Raw Milk",
      "quantity": 30,
      "unit": "litre"
    }
  ],
  "notes": "Evening milking"
}
```

**Returns:** Created processing record object

#### `updateAnimalProcess`

Update existing processing record.

**Endpoint:** `PUT /api/project/animal-group/animal/{animalId}/processes/{processId}`

**Payload:** Same structure as createAnimalProcess

**Returns:** Updated processing record object

#### `deleteAnimalProcess`

Delete processing record.

**Endpoint:** `DELETE /api/project/animal-group/animal/{animalId}/processes/{processId}`

**Returns:** 204 No Content

## Plant Diseases

### File: `plant-disease.ts`

#### `getAllPlantDiseases`

Get all disease records for a species.

**Endpoint:** `GET /api/project/planting-event/species/{speciesId}/diseases`

**Returns:**

```json
[
  {
    "id": "disease_uuid",
    "species": "species_uuid",
    "name": "Powdery Mildew",
    "date": "2024-04-10",
    "severity": "moderate",
    "affected_area": 15.5,
    "treatments": [
      {
        "id": "treatment_uuid",
        "treatment": "Fungicide spray",
        "date": "2024-04-11"
      }
    ]
  }
]
```

#### `getPlantDiseaseById`

Get single disease record by ID.

**Endpoint:** `GET /api/project/planting-event/species/{speciesId}/diseases/{diseaseId}`

**Returns:** Single disease record object

#### `createPlantDisease`

Create new disease record.

**Endpoint:** `POST /api/project/planting-event/species/{speciesId}/diseases`

**Payload:**

```json
{
  "name": "Leaf Rust",
  "date": "2024-05-01",
  "severity": "low",
  "affected_area": 5.0,
  "notes": "Early detection"
}
```

**Returns:** Created disease record object

#### `updatePlantDisease`

Update existing disease record.

**Endpoint:** `PUT /api/project/planting-event/species/{speciesId}/diseases/{diseaseId}`

**Payload:** Same structure as createPlantDisease

**Returns:** Updated disease record object

#### `deletePlantDisease`

Delete disease record.

**Endpoint:** `DELETE /api/project/planting-event/species/{speciesId}/diseases/{diseaseId}`

**Returns:** 204 No Content

## Plant Disease Management

### File: `plant-disease-management.ts`

#### `getAllPlantDiseaseTreatments`

Get all treatments for a plant disease.

**Endpoint:** `GET /api/project/planting-event/species/{speciesId}/disease/{diseaseId}/plant-disease-managements`

**Returns:**

```json
[
  {
    "id": "treatment_uuid",
    "disease": "disease_uuid",
    "treatment": "Organic fungicide application",
    "date": "2024-04-12",
    "application_method": "spray",
    "dosage": "500ml per 100sqm",
    "effectiveness": "high",
    "notes": "Applied in early morning"
  }
]
```

#### `getPlantDiseaseTreatmentById`

Get single treatment record by ID.

**Endpoint:** `GET /api/project/planting-event/species/{speciesId}/disease/{diseaseId}/plant-disease-management/{treatmentId}`

**Returns:** Single treatment record object

#### `createPlantDiseaseTreatment`

Create new treatment record.

**Endpoint:** `POST /api/project/planting-event/species/{speciesId}/disease/{diseaseId}/plant-disease-managements`

**Payload:**

```json
{
  "treatment": "Copper-based fungicide",
  "date": "2024-05-05",
  "application_method": "spray",
  "dosage": "200ml per 50sqm",
  "notes": "Second application scheduled for 7 days"
}
```

**Returns:** Created treatment record object

#### `updatePlantDiseaseTreatment`

Update existing treatment record.

**Endpoint:** `PUT /api/project/planting-event/species/{speciesId}/disease/{diseaseId}/plant-disease-management/{treatmentId}`

**Payload:** Same structure as createPlantDiseaseTreatment

**Returns:** Updated treatment record object

#### `deletePlantDiseaseTreatment`

Delete treatment record.

**Endpoint:** `DELETE /api/project/planting-event/species/{speciesId}/disease/{diseaseId}/plant-disease-management/{treatmentId}`

**Returns:** 204 No Content

## Plant Pests

### File: `plant-pest.ts`

#### `getAllPlantPests`

Get all pest records for a species.

**Endpoint:** `GET /api/project/planting-event/species/{speciesId}/pests`

**Returns:**

```json
[
  {
    "id": "pest_uuid",
    "species": "species_uuid",
    "name": "Aphids",
    "date": "2024-04-15",
    "severity": "moderate",
    "affected_area": 10.0,
    "treatments": [
      {
        "id": "treatment_uuid",
        "treatment": "Neem oil spray",
        "date": "2024-04-16"
      }
    ]
  }
]
```

#### `getPlantPestById`

Get single pest record by ID.

**Endpoint:** `GET /api/project/planting-event/species/{speciesId}/pests/{pestId}`

**Returns:** Single pest record object

#### `createPlantPest`

Create new pest record.

**Endpoint:** `POST /api/project/planting-event/species/{speciesId}/pests`

**Payload:**

```json
{
  "name": "Caterpillars",
  "date": "2024-05-10",
  "severity": "high",
  "affected_area": 20.0,
  "notes": "Heavy infestation on leaves"
}
```

**Returns:** Created pest record object

#### `updatePlantPest`

Update existing pest record.

**Endpoint:** `PUT /api/project/planting-event/species/{speciesId}/pests/{pestId}`

**Payload:** Same structure as createPlantPest

**Returns:** Updated pest record object

#### `deletePlantPest`

Delete pest record.

**Endpoint:** `DELETE /api/project/planting-event/species/{speciesId}/pests/{pestId}`

**Returns:** 204 No Content

## Plant Pest Management

### File: `plant-pest-management.ts`

#### `getAllPlantPestTreatments`

Get all treatments for a plant pest.

**Endpoint:** `GET /api/project/planting-event/species/{speciesId}/pest/{pestId}/plant-pest-managements`

**Returns:**

```json
[
  {
    "id": "treatment_uuid",
    "pest": "pest_uuid",
    "treatment": "Insecticidal soap",
    "date": "2024-04-17",
    "application_method": "spray",
    "dosage": "100ml per liter water",
    "effectiveness": "moderate",
    "notes": "Repeat weekly if needed"
  }
]
```

#### `getPlantPestTreatmentById`

Get single treatment record by ID.

**Endpoint:** `GET /api/project/planting-event/species/{speciesId}/pest/{pestId}/plant-pest-management/{treatmentId}`

**Returns:** Single treatment record object

#### `createPlantPestTreatment`

Create new treatment record.

**Endpoint:** `POST /api/project/planting-event/species/{speciesId}/pest/{pestId}/plant-pest-managements`

**Payload:**

```json
{
  "treatment": "Biological control - Ladybugs",
  "date": "2024-05-12",
  "application_method": "release",
  "dosage": "500 ladybugs per acre",
  "notes": "Natural predator introduction"
}
```

**Returns:** Created treatment record object

#### `updatePlantPestTreatment`

Update existing treatment record.

**Endpoint:** `PUT /api/project/planting-event/species/{speciesId}/pest/{pestId}/plant-pest-management/{treatmentId}`

**Payload:** Same structure as createPlantPestTreatment

**Returns:** Updated treatment record object

#### `deletePlantPestTreatment`

Delete treatment record.

**Endpoint:** `DELETE /api/project/planting-event/species/{speciesId}/pest/{pestId}/plant-pest-management/{treatmentId}`

**Returns:** 204 No Content

## Plant Harvest

### File: `plant-harvest.ts`

#### `getAllPlantHarvests`

Get all harvest records for a species.

**Endpoint:** `GET /api/project/planting-event/species/{speciesId}/harvests`

**Returns:**

```json
[
  {
    "id": "harvest_uuid",
    "species": "species_uuid",
    "date": "2024-07-20",
    "quantity": 450.5,
    "unit": "kilogram",
    "quality_grade": "Premium",
    "storage_location": "Warehouse A",
    "notes": "Excellent yield this season"
  }
]
```

#### `getPlantHarvestById`

Get single harvest record by ID.

**Endpoint:** `GET /api/project/planting-event/species/{speciesId}/harvests/{harvestId}`

**Returns:** Single harvest record object

#### `createPlantHarvest`

Create new harvest record.

**Endpoint:** `POST /api/project/planting-event/species/{speciesId}/harvests`

**Payload:**

```json
{
  "date": "2024-08-01",
  "quantity": 325.0,
  "unit": "kilogram",
  "quality_grade": "Grade A",
  "storage_location": "Cold Storage B",
  "notes": "Second harvest of the season"
}
```

**Returns:** Created harvest record object

#### `updatePlantHarvest`

Update existing harvest record.

**Endpoint:** `PUT /api/project/planting-event/species/{speciesId}/harvests/{harvestId}`

**Payload:** Same structure as createPlantHarvest

**Returns:** Updated harvest record object

#### `deletePlantHarvest`

Delete harvest record.

**Endpoint:** `DELETE /api/project/planting-event/species/{speciesId}/harvests/{harvestId}`

**Returns:** 204 No Content

## Fertility Spread

### File: `fertility-spread.ts`

#### `getAllFertilitySpreads`

Get all fertility spread records for a planting event.

**Endpoint:** `GET /api/project/planting-event/{plantingEventId}/fertility-spreads`

**Returns:**

```json
[
  {
    "id": "fertility_uuid",
    "planting_event": "planting_event_uuid",
    "name": "NPK Fertilizer",
    "type": "fertilizer",
    "start_date": "2024-03-20",
    "end_date": "2024-04-10",
    "application_rate": "50kg per hectare",
    "notes": "Split application over 3 weeks"
  }
]
```

#### `getFertilitySpreadById`

Get single fertility spread record by ID.

**Endpoint:** `GET /api/project/planting-event/{plantingEventId}/fertility-spread/{id}`

**Returns:** Single fertility spread record object

#### `createFertilitySpread`

Create new fertility spread record.

**Endpoint:** `POST /api/project/planting-event/{plantingEventId}/fertility-spreads`

**Payload:**

```json
{
  "name": "Organic Compost",
  "type": "fertilizer",
  "start_date": "2024-05-01",
  "end_date": "2024-05-15",
  "application_rate": "2 tons per hectare",
  "notes": "Applied before planting"
}
```

**Returns:** Created fertility spread record object

#### `updateFertilitySpread`

Update existing fertility spread record.

**Endpoint:** `PUT /api/project/planting-event/{plantingEventId}/fertility-spread/{id}`

**Payload:** Same structure as createFertilitySpread

**Returns:** Updated fertility spread record object

#### `deleteFertilitySpread`

Delete fertility spread record.

**Endpoint:** `DELETE /api/project/planting-event/{plantingEventId}/fertility-spread/{id}`

**Returns:** 204 No Content

## Common Patterns

### Authentication

All authenticated endpoints require the `Authorization` header with a Bearer token:

```
Authorization: Bearer {access_token}
```

### Error Responses

All endpoints may return these common error responses:

**400 Bad Request:**

```json
{
  "error": "Validation error message",
  "details": {
    "field_name": ["Error message"]
  }
}
```

**401 Unauthorized:**

```json
{
  "detail": "Authentication credentials were not provided."
}
```

**403 Forbidden:**

```json
{
  "detail": "You do not have permission to perform this action."
}
```

**404 Not Found:**

```json
{
  "detail": "Not found."
}
```

**500 Internal Server Error:**

```json
{
  "error": "Internal server error"
}
```

### Pagination

Paginated endpoints return responses in this format:

```json
{
  "count": 100,
  "next": "http://api.example.org/endpoint/?page=3",
  "previous": "http://api.example.org/endpoint/?page=1",
  "results": [...]
}
```

### Enums

**Address Type:**

- `P` - Primary
- `S` - Secondary

**Project Status:**

- `active` - Active
- `completed` - Completed
- `archived` - Archived

**Project Type:**

- `planting` - Planting Project
- `animal_keeping` - Animal Keeping Project

**Finance Kind:**

- `income` - Income
- `expense` - Expense

**Unit Types:**

- `gallon` - GALLON
- `litre` - LITRE
- `kilogram` - KILOGRAM
- `pound` - POUND
- `ton` - TON
- `tonne` - TONNE
- `hectare` - HECTARE
- `acre` - ACRE

**Gender:**

- `MALE` - Male
- `FEMALE` - Female
- `MIXED` - Mixed

**Housing Types:**

- `barn` - Barn
- `coop` - Coop
- `pasture` - Pasture
- `pen` - Pen

## Notes

1. All dates are in ISO 8601 format (`YYYY-MM-DD`)
2. All timestamps are in ISO 8601 format with timezone (`YYYY-MM-DDTHH:MM:SSZ`)
3. All IDs are UUIDs in string format
4. All monetary values are strings representing decimal numbers
5. File uploads should use `multipart/form-data` content type
6. Most write operations support three content types: `application/json`, `application/x-www-form-urlencoded`, and `multipart/form-data`
7. Nested objects (like soil, weather, location) can be included inline when creating/updating parent objects
8. The API uses JWT authentication with access and refresh tokens
9. Access tokens expire after a set period and must be refreshed using the refresh token
10. All actions are Redux Toolkit async thunks that automatically handle loading states and errors
