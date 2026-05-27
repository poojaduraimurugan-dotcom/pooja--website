import React, { useState, useEffect } from 'react';

const MockAssessmentPage = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/assessments/mock-assessments')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAssessments(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching assessments:", err);
                setLoading(false);
            });
    }, []);

    const handleStartAssessment = async (assessment) => {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            alert("Please login first to save your assessment results!");
            return;
        }

        // In a full implementation, you would redirect to a test-taking UI.
        // Here we simulate the process of finishing a test and saving the score.
        if (window.confirm(`Do you want to simulate completing the ${assessment.title}?`)) {
            const resultPayload = {
                user_id: userId,
                test_name: assessment.title,
                score: "85%", // Simulated score
                status: "Passed",
                duration: assessment.duration,
                marks: `${Math.floor(assessment.questions * 0.85)}/${assessment.questions}`,
                date: new Date().toISOString().slice(0, 10)
            };

            try {
                const response = await fetch('http://localhost:8000/api/mocktests/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(resultPayload)
                });
                const data = await response.json();
                if (data.success) {
                    alert("Assessment results saved successfully! Check your dashboard.");
                }
            } catch (err) {
                console.error("Error saving result:", err);
            }
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading assessments...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Mock Assessments</h1>
            <p>Select an assessment to start your practice session.</p>
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {assessments.map(item => (
                    <div key={item.id} style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        padding: '15px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}>
                        <h3>{item.title}</h3>
                        <p><strong>Duration:</strong> {item.duration}</p>
                        <p><strong>Total Questions:</strong> {item.questions}</p>
                        <button style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '10px 15px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        onClick={() => handleStartAssessment(item)}>
                            Start Assessment
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MockAssessmentPage;