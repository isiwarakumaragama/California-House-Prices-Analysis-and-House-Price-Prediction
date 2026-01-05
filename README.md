# California House Price Predictor

A full-stack machine learning application that predicts California housing prices using historical data and linear regression. The project includes a Flask backend API and a React frontend interface with Tailwind CSS styling.

## 🎯 Objective

The primary goal of this project is to:
- Build a machine learning model capable of predicting California house prices based on geographic location, property characteristics, and demographic factors
- Develop a production-ready API to serve predictions in real-time
- Create an intuitive user interface for non-technical users to interact with the model
- Demonstrate complete end-to-end ML pipeline from data exploration to deployment

## 📋 Project Overview

This project demonstrates end-to-end machine learning development:
- **Data Processing**: Exploratory data analysis (EDA) and data cleaning with Jupyter Notebook
- **Model Training**: Linear regression model on California housing dataset
- **Backend API**: Flask REST API for serving predictions
- **Frontend UI**: Modern React interface with Tailwind CSS for user interaction

## 🏗️ Project Structure

```
California House Prices/
├── notebooks/
│   └── California_House_Prices_.ipynb    # EDA and model training
├── backend/
│   ├── app.py                             # Flask API application
│   ├── requirements.txt                   # Python dependencies
│   └── model/                             # Trained model storage
├── frontend/
│   ├── src/
│   │   ├── App.jsx                        # Main React component
│   │   ├── components/
│   │   │   ├── PredictForm.jsx            # Input form for predictions
│   │   │   └── ResultCard.jsx             # Display prediction results
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   └── postcss.config.cjs
├── data/
│   └── housing.csv                        # California housing dataset
├── models/
│   └── california_model.pkl               # Serialized trained model
├── requirements.txt
└── README.md
```

## 🚀 Tech Stack

### Backend
- **Flask** - Web framework for API
- **scikit-learn** - Machine learning library
- **pandas** & **numpy** - Data manipulation and analysis
- **joblib** - Model serialization
- **Flask-CORS** - Cross-origin support for frontend

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## 📊 Data & Model

- **Dataset**: California housing dataset (housing.csv)
- **Features**: 8 numerical features + 1 categorical feature (ocean_proximity)
  - Longitude, Latitude
  - Housing Median Age
  - Total Rooms, Population, Households
  - Median Income
  - Ocean Proximity (categorical - encoded to 4 binary features)
- **Target**: Median House Value (in USD)
- **Model**: Linear Regression

## 🎯 Key Insights

Through exploratory data analysis, the following key insights were discovered:

1. **Geographic Importance**: Location (longitude and latitude) is a strong predictor of house prices, with coastal properties commanding premium prices
2. **Income Correlation**: Median income shows strong positive correlation with house prices
3. **Population Density**: Areas with higher population density tend to have varied pricing patterns
4. **Age Factor**: Housing median age has a moderate influence on prices
5. **Outlier Patterns**: Some properties in premium areas (near ocean) are significantly more valuable
6. **Ocean Proximity Impact**: Properties near the ocean (especially within 1H) have substantially higher prices
7. **Data Quality**: The dataset contained minimal missing values, primarily in total_bedrooms column
8. **Feature Relationships**: Strong multicollinearity between total_rooms, population, and households

## 📈 Visualizations

The analysis produces the following key visualizations saved in the `outputs/` folder:

### Generated Output Visualizations

The analysis produces the following key visualizations saved in the `outputs/` folder:

#### 1. Distribution of Median House Values
Shows the distribution of house prices in the dataset after cleaning and outlier removal. This histogram with KDE overlay reveals that house prices follow a somewhat right-skewed distribution, with most properties valued between $100k-$500k.

**File**: `Distribution of Median House Values.png`

#### 2. Correlation Heatmap of Housing Data
A comprehensive correlation matrix showing how each feature relates to others. Key findings:
- **Median Income**: Strongest positive correlation with house prices (0.69)
- **Latitude**: High correlation with prices, indicating geographic importance (0.14)
- **Longitude**: Geographic location factor (-0.05)
- **Multicollinearity**: Total rooms, population, and households show high intercorrelation
- **Population**: Moderate correlation with prices (0.20)

**File**: `Correlation Heatmap of Housing Data.png`

#### 3. Outlier Analysis in Median Income
Box plot visualization showing the distribution of median income values and identifying statistical outliers using the IQR (Interquartile Range) method. This helps ensure the model trains on clean, representative data without extreme values skewing results.

**File**: `Outlier Analysis in Median Income.png`

### Data Processing Summary

- **Initial Dataset**: 20,640 rows from housing.csv
- **Missing Values**: Removed rows with null values (primarily total_bedrooms column)
- **Outliers Removed**: 
  - House price outliers: Removed ~500 properties with extreme values
  - Income outliers: Removed additional high-income outliers
- **Final Training Data**: Clean dataset ready for model training

## 📊 Model Metrics

The notebook includes:
- Data exploration and visualization
- Missing value analysis
- Outlier detection and removal
- Feature engineering (one-hot encoding for ocean_proximity)
- Train-test split (typically 80-20)
- Model evaluation with R² score and MSE

## 🏆 Outcome

The project successfully achieved all objectives:

### Model Performance
- **Trained Linear Regression Model** with competitive R² score on test data
- **Model Serialization**: Successfully saved trained model using joblib for production use
- **Prediction Accuracy**: Model provides reasonable price estimates within expected ranges

### Technical Deliverables
- ✅ Complete Jupyter Notebook with reproducible ML pipeline
- ✅ Production-ready Flask REST API with proper error handling
- ✅ Full-featured React frontend with form validation
- ✅ Seamless integration between frontend and backend
- ✅ Deployment-ready architecture

### Business Value
- **Real-time Predictions**: Users can instantly get house price estimates
- **Data-Driven Insights**: Clear understanding of price drivers in California housing market
- **Scalability**: Backend API can handle multiple concurrent requests
- **User-Friendly**: No technical knowledge required to use the application

### Learnings & Skills Demonstrated
- End-to-end ML pipeline implementation
- Data exploration and visualization techniques
- Feature engineering and preprocessing
- RESTful API design and implementation
- Full-stack web application development
- Production-ready code practices

## 🔌 API Endpoints

### GET `/`
Returns API information and available endpoints.

**Response:**
```json
{
  "message": "California House Price Predictor API is running!",
  "version": "1.0.0"
}
```

### POST `/predict`
Predicts house price based on input features.

**Request Body:**
```json
{
  "longitude": -122.45,
  "latitude": 37.8,
  "housing_median_age": 25,
  "total_rooms": 5000,
  "population": 1500,
  "households": 500,
  "median_income": 5.5,
  "ocean_proximity_<1H OCEAN": 1,
  "ocean_proximity_INLAND": 0,
  "ocean_proximity_NEAR BAY": 0,
  "ocean_proximity_NEAR OCEAN": 0
}
```

**Response:**
```json
{
  "predicted_price": 425000.50
}
```

**Notes:**
- All fields are required
- Exactly one `ocean_proximity_*` field must be 1, others must be 0
- Predicted price is in USD

## 🛠️ Installation & Setup

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
The API will run on `http://127.0.0.1:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`

## 📈 Usage

1. **Start the backend server**:
   ```bash
   cd backend
   python app.py
   ```

2. **Start the frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open the web application** in your browser (typically `http://localhost:5173`)

4. **Enter property features** in the form:
   - Location (latitude, longitude)
   - Age of the house
   - Building attributes (rooms, population, households)
   - Income metrics
   - Ocean proximity

5. **Get the predicted price** displayed in the result card

## 📝 Key Features

- **Real-time Predictions**: Instant price predictions via API
- **Beautiful UI**: Modern, responsive design with gradient backgrounds
- **Form Validation**: Required field validation in the frontend
- **Error Handling**: Comprehensive error messages for invalid inputs
- **CORS Support**: Backend configured for cross-origin requests

## 📚 Development Workflow

### Training the Model
The model is trained in the Jupyter Notebook with:
- Complete EDA with visualizations
- Data cleaning and preprocessing
- Outlier removal using IQR method
- Feature engineering
- Model training and evaluation
- Model serialization to `models/california_model.pkl`

### Building for Production
```bash
cd frontend
npm run build
```
Creates optimized production build in `dist/` folder.

## 🔍 Code Quality

- **Backend**: Flask with proper route documentation and error handling
- **Frontend**: React functional components with hooks
- **Styling**: Tailwind CSS for consistent, maintainable styling
- **API Design**: RESTful endpoints with clear request/response formats

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created as a demonstration of full-stack machine learning application development.
