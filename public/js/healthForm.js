document.addEventListener("DOMContentLoaded", function () {
    const healthForm = document.getElementById("health-form");
    const API_BASE_URL = 'http://localhost:3000';


    if (healthForm && window.location.pathname.includes('try.html')) {
        healthForm.addEventListener("submit", async function (event) {
            event.preventDefault();


            const gender = document.getElementById('gender').value;
            const weight = document.getElementById('weight').value;
            const height = document.getElementById('height').value;
            const bloodPressure = document.getElementById('blood-pressure').value;
            const oxygenSaturation = document.getElementById('oxygen-sat').value;


            const user = JSON.parse(localStorage.getItem('user'));
            const username = user ? user.username : null;


            const loadingIndicator = document.getElementById('loading');
            const recommendationsSection = document.getElementById('recommendations-section');
            const recommendationsContent = document.getElementById('recommendations-content');

            recommendationsSection.style.display = 'block';
            loadingIndicator.style.display = 'block';
            recommendationsContent.innerHTML = '';


            const prompt = `Based on the following health data, provide concise health recommendations:
            - Gender: ${gender}
            - Weight: ${weight} kg
            - Height: ${height} cm
            - Blood Pressure: ${bloodPressure}
            - Oxygen Saturation: ${oxygenSaturation}%

            Give specific actionable recommendations regarding diet, exercise, and lifestyle based on these metrics. Format your response with markdown headers for categories (### Diet, ### Exercise, ### Lifestyle) and bullet points for specific recommendations.`;


            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
                    'x-rapidapi-key': 'fe23ba1c2cmshebaea69ff31f125p117ba1jsna9a7ff75cdf9'
                },
                body: JSON.stringify({
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "system_prompt": "You are a health advisor that provides concise, evidence-based health recommendations. Format your response with markdown headers for categories (### Diet, ### Exercise, ### Lifestyle) and bullet points for specific recommendations. Do not use bold formatting (**) in your headers. Do not add any additional messages at the beginning or at the end, the response should only contain the recommendations.",
                    "temperature": 0.7,
                    "top_k": 5,
                    "top_p": 0.9,
                    "max_tokens": 256,
                    "web_access": false
                })
            };

            try {

                const response = await fetch('https://chatgpt-42.p.rapidapi.com/conversationgpt4', options);
                const data = await response.json();


                loadingIndicator.style.display = 'none';


                if (data && data.result) {
                    const recommendations = data.result;

                    let formattedHTML = '<div class="recommendations-container">';
                    const lines = recommendations.split('\n').filter(line => line.trim() !== '');

                    lines.forEach(line => {
                        line = line.trim();


                        if (line.startsWith('###')) {
                            let headerText = line.replace('###', '').trim();
                            headerText = headerText.replace(/\*\*/g, '').trim();
                            formattedHTML += `<h3>${headerText}</h3>`;
                        }

                        else if (line.startsWith('####')) {
                            let headerText = line.replace('####', '').trim();
                            headerText = headerText.replace(/\*\*/g, '').trim();
                            formattedHTML += `<h4>${headerText}</h4>`;
                        }

                        else if (line.startsWith('-') || line.startsWith('*') && !line.startsWith('**')) {
                            let bulletText = line.substring(1).trim();
                            bulletText = bulletText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                            formattedHTML += `<div class="recommendation-item">${bulletText}</div>`;
                        }

                        else {
                            let processedText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                            formattedHTML += `<p>${processedText}</p>`;
                        }
                    });

                    formattedHTML += '</div>';
                    recommendationsContent.innerHTML = formattedHTML;


                    if (username) {
                        try {
                            const saveResponse = await fetch(`${API_BASE_URL}/health-assessment`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    username,
                                    gender,
                                    weight,
                                    height,
                                    bloodPressure,
                                    oxygenSaturation,
                                    recommendations: data.result
                                })
                            });

                            if (saveResponse.ok) {
                                console.log('Health assessment saved successfully');

                                const savedMessage = document.createElement('div');
                                savedMessage.className = 'saved-message';
                                savedMessage.innerHTML = '<p>Your health assessment has been saved. <a href="history.html">View History</a></p>';
                                recommendationsContent.appendChild(savedMessage);
                            } else {
                                console.error('Error saving health assessment');
                            }
                        } catch (saveError) {
                            console.error('Error saving health assessment:', saveError);
                        }
                    } else {
                        console.log('User not logged in, assessment not saved');

                        const loginPrompt = document.createElement('div');
                        loginPrompt.className = 'login-prompt';
                        loginPrompt.innerHTML = '<p>Log in to save your health assessment and view history!</p><a href="log.html" class="btn-small">Log In</a>';
                        recommendationsContent.appendChild(loginPrompt);
                    }


                    recommendationsSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    recommendationsContent.innerHTML = '<p class="error-message">Sorry, we could not generate recommendations at this time. Please try again later.</p>';
                }
            } catch (error) {
                loadingIndicator.style.display = 'none';
                recommendationsContent.innerHTML = '<p class="error-message">An error occurred while getting recommendations. Please try again later.</p>';
                console.error('Error:', error);
            }
        });
    }
});