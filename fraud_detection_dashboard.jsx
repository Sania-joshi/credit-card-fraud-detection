import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const FraudDetectionDashboard = () => {
  // Sample data from the ML pipeline
  const modelData = {
    'Logistic Regression': {
      accuracy: 0.9823,
      precision: 0.8945,
      recall: 0.8234,
      f1_score: 0.8567,
      auc_score: 0.9456,
      false_negatives: 12
    },
    'Random Forest': {
      accuracy: 0.9892,
      precision: 0.9234,
      recall: 0.8967,
      f1_score: 0.9098,
      auc_score: 0.9678,
      false_negatives: 8
    },
    'XGBoost': {
      accuracy: 0.9934,
      precision: 0.9567,
      recall: 0.9234,
      f1_score: 0.9398,
      auc_score: 0.9823,
      false_negatives: 5
    },
    'LightGBM': {
      accuracy: 0.9945,
      precision: 0.9623,
      recall: 0.9456,
      f1_score: 0.9538,
      auc_score: 0.9876,
      false_negatives: 4
    }
  };

  const [selectedMetric, setSelectedMetric] = useState('accuracy');
  const [selectedModel, setSelectedModel] = useState(null);

  // Prepare data for model comparison chart
  const modelComparisonData = useMemo(() => {
    return Object.entries(modelData).map(([name, metrics]) => ({
      name: name.replace(' ', '\n'),
      fullName: name,
      accuracy: (metrics.accuracy * 100).toFixed(2),
      precision: (metrics.precision * 100).toFixed(2),
      recall: (metrics.recall * 100).toFixed(2),
      f1_score: (metrics.f1_score * 100).toFixed(2),
      auc_score: (metrics.auc_score * 100).toFixed(2)
    }));
  }, []);

  // Prepare data for radar chart
  const radarData = useMemo(() => {
    if (!selectedModel) return [];
    const model = modelData[selectedModel];
    return [
      { metric: 'Accuracy', value: Math.round(model.accuracy * 100) },
      { metric: 'Precision', value: Math.round(model.precision * 100) },
      { metric: 'Recall', value: Math.round(model.recall * 100) },
      { metric: 'F1-Score', value: Math.round(model.f1_score * 100) },
      { metric: 'AUC-ROC', value: Math.round(model.auc_score * 100) }
    ];
  }, [selectedModel]);

  // False negatives comparison
  const falseNegativesData = useMemo(() => {
    return Object.entries(modelData).map(([name, metrics]) => ({
      name: name,
      'False Negatives': metrics.false_negatives
    }));
  }, []);

  // Performance summary for selected model
  const getPerformanceSummary = () => {
    if (!selectedModel) return null;
    const metrics = modelData[selectedModel];
    return [
      { label: 'Accuracy', value: (metrics.accuracy * 100).toFixed(2) + '%' },
      { label: 'Precision', value: (metrics.precision * 100).toFixed(2) + '%' },
      { label: 'Recall', value: (metrics.recall * 100).toFixed(2) + '%' },
      { label: 'F1-Score', value: (metrics.f1_score * 100).toFixed(2) + '%' },
      { label: 'AUC-ROC', value: (metrics.auc_score * 100).toFixed(2) + '%' },
      { label: 'False Negatives', value: metrics.false_negatives }
    ];
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '12px',
          borderRadius: '8px',
          border: '2px solid #10b981'
        }}>
          <p style={{ color: '#10b981', margin: '0 0 4px 0', fontWeight: 'bold' }}>
            {payload[0].name}
          </p>
          <p style={{ color: '#fff', margin: 0 }}>
            {selectedMetric === 'false_negatives' ? payload[0].value : payload[0].value.toFixed(2) + '%'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#e2e8f0',
      padding: '40px 20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Header */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: 700,
            margin: '0 0 12px 0',
            background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🛡️ Credit Card Fraud Detection
          </h1>
          <p style={{ fontSize: '16px', color: '#94a3b8', margin: 0 }}>
            Machine Learning Model Comparison & Performance Analysis
          </p>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Model Comparison Chart */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                margin: '0 0 4px 0',
                color: '#06b6d4'
              }}>
                Model Comparison
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Select a metric to compare all models
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {['accuracy', 'precision', 'recall', 'f1_score', 'auc_score'].map(metric => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid',
                    backgroundColor: selectedMetric === metric ? '#06b6d4' : 'transparent',
                    borderColor: selectedMetric === metric ? '#06b6d4' : '#334155',
                    color: selectedMetric === metric ? '#0f172a' : '#cbd5e1',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  {metric.toUpperCase().replace('_', ' ')}
                </button>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey={selectedMetric.replace('_', '')} fill="#10b981" radius={[8, 8, 0, 0]}>
                  {modelComparisonData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? '#06b6d4' : '#10b981'}
                      opacity={selectedModel && selectedModel !== entry.fullName ? 0.4 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* False Negatives Chart */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                margin: '0 0 4px 0',
                color: '#ef4444'
              }}>
                False Negatives (Fraud Missed)
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Lower is better - fewer frauds go undetected
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={falseNegativesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '2px solid #ef4444',
                    borderRadius: '8px'
                  }}
                  cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }}
                />
                <Bar dataKey="False Negatives" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Selection & Radar Chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Model Selector */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(10px)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              margin: '0 0 20px 0',
              color: '#10b981'
            }}>
              Select Model for Details
            </h2>

            <div style={{ display: 'grid', gap: '12px' }}>
              {Object.keys(modelData).map(model => (
                <button
                  key={model}
                  onClick={() => setSelectedModel(selectedModel === model ? null : model)}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '2px solid',
                    backgroundColor: selectedModel === model ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                    borderColor: selectedModel === model ? '#10b981' : '#334155',
                    color: '#e2e8f0',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    textAlign: 'left',
                    transition: 'all 0.3s'
                  }}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* Radar Chart for Selected Model */}
          {selectedModel && radarData.length > 0 && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: '16px',
              padding: '28px',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                margin: '0 0 20px 0',
                color: '#06b6d4'
              }}>
                {selectedModel} - Performance Profile
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" stroke="#94a3b8" />
                  <PolarRadiusAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Radar name={selectedModel} dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '2px solid #06b6d4',
                      borderRadius: '8px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Performance Summary */}
        {selectedModel && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(10px)',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              margin: '0 0 24px 0',
              color: '#10b981'
            }}>
              {selectedModel} - Detailed Metrics
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {getPerformanceSummary().map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                  }}
                >
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    margin: '0 0 8px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#10b981',
                    margin: 0
                  }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '16px',
          padding: '28px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            margin: '0 0 20px 0',
            color: '#3b82f6'
          }}>
            📊 Key Insights
          </h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid #10b981', borderRadius: '4px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>Best Overall:</strong> LightGBM achieves 99.45% accuracy with only 4 false negatives
              </p>
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(6, 182, 212, 0.1)', borderLeft: '4px solid #06b6d4', borderRadius: '4px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>Highest AUC-ROC:</strong> LightGBM (0.9876) - Best at distinguishing fraud from normal transactions
              </p>
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>SMOTE Impact:</strong> Balancing techniques significantly improved fraud recall across all models
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudDetectionDashboard;
