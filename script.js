document.addEventListener('DOMContentLoaded', function() {
    // FAQ functionality
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            
            // Toggle current item
            this.classList.toggle('active');
            answer.classList.toggle('active');
            icon.textContent = this.classList.contains('active') ? '×' : '+';
            
            // Close others
            document.querySelectorAll('.faq-question').forEach(q => {
                if (q !== question) {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('active');
                    q.querySelector('.faq-icon').textContent = '+';
                }
            });
        });
    });

    // Fetch farmer data
    document.querySelector('.fetch-button').addEventListener('click', async function() {
        const farmerID = document.getElementById('FarmerID').value.trim();
        
        if (!farmerID) {
            alert('Please enter Farmer ID');
            return;
        }

        try {
            const response = await fetch('api/api.php?action=fetch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ farmerID })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch data');
            }

            // Display results
            const modal = document.createElement('div');
            modal.className = 'farmer-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Farmer Details</h3>
                    <p><strong>Name:</strong> ${data.farmer.FirstName} ${data.farmer.LastName}</p>
                    <p><strong>Village:</strong> ${data.farmer.Village}</p>
                    <p><strong>Contact:</strong> ${data.farmer.ContactNumber}</p>
                    <p><strong>Status:</strong> ${data.farmer.Status}</p>
                    ${data.animals.length ? `
                    <h4>Animals:</h4>
                    <ul>
                        ${data.animals.map(animal => `
                        <li>${animal.AnimalID} (${animal.AnimalType})</li>
                        `).join('')}
                    </ul>
                    ` : ''}
                    <button class="close-modal">Close</button>
                </div>
            `;
            
            modal.querySelector('.close-modal').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            document.body.appendChild(modal);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    });

    // Registration functionality
    document.querySelector('.signup-button').addEventListener('click', function() {
        const modal = document.createElement('div');
        modal.className = 'registration-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>New Farmer Registration</h2>
                <form id="registrationForm">
                    <div class="form-group">
                        <label>First Name* <input type="text" id="regFirstName" required></label>
                    </div>
                    <div class="form-group">
                        <label>Last Name* <input type="text" id="regLastName" required></label>
                    </div>
                    <div class="form-group">
                        <label>Village* <input type="text" id="regVillage" required></label>
                    </div>
                    <div class="form-group">
                        <label>Contact Number* <input type="tel" id="regContact" required></label>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="submit-btn">Register</button>
                        <button type="button" class="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#registrationForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                FirstName: document.getElementById('regFirstName').value,
                LastName: document.getElementById('regLastName').value,
                Village: document.getElementById('regVillage').value,
                ContactNumber: document.getElementById('regContact').value
            };

            try {
                const response = await fetch('api/api.php?action=register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }

                alert(`Registration successful! Your Farmer ID: ${data.farmerID}`);
                document.getElementById('FarmerID').value = data.farmerID;
                document.body.removeChild(modal);
                
            } catch (error) {
                console.error('Error:', error);
                alert('Error: ' + error.message);
            }
        });

        document.body.appendChild(modal);
    });
});