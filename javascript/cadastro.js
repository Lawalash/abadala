document.addEventListener("DOMContentLoaded", function () {
  // Variáveis e funções para a navegação entre etapas do formulário
  const form = document.getElementById("registrationForm");
  const formSteps = document.querySelectorAll(".form-step");
  const nextButtons = document.querySelectorAll(".btn-next");
  const prevButtons = document.querySelectorAll(".btn-prev");
  const stepIndicators = document.querySelectorAll(".step");
  let currentStep = 0;

  function showStep(index) {
    formSteps.forEach((step, i) => {
      step.classList.toggle("active", i === index);
    });
    stepIndicators.forEach((indicator, i) => {
      if (i <= index) {
        indicator.classList.add("active", "completed");
      } else {
        indicator.classList.remove("active", "completed");
      }
    });
  }

  nextButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const currentFormStep = formSteps[currentStep];
      const requiredFields = currentFormStep.querySelectorAll(
        "input[required], select[required], textarea[required]"
      );
      let allValid = true;
      requiredFields.forEach((field) => {
        if (!field.value) {
          field.classList.add("is-invalid");
          allValid = false;
        } else {
          field.classList.remove("is-invalid");
        }
      });
      if (allValid) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  prevButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      currentStep--;
      showStep(currentStep);
    });
  });

  // ----- CONFIGURAÇÃO DOS CARDS DE PLANO E BENEFÍCIOS COLAPSÁVEIS -----
  const planCards = document.querySelectorAll(".plan-card");

  planCards.forEach(card => {
    const benefitsToggle = card.querySelector(".benefits-toggle");
    const featuresList = card.querySelector(".plan-features");
    
    if (benefitsToggle && featuresList) {
      benefitsToggle.addEventListener("click", function(e) {
        e.stopPropagation(); // Impede a seleção do card ao clicar no toggle
        const icon = this.querySelector("i");
        featuresList.classList.toggle("open");
        if (icon) {
          icon.classList.toggle("fa-chevron-down");
          icon.classList.toggle("fa-chevron-up");
        }
        card.classList.add("pulse");
        setTimeout(() => {
          card.classList.remove("pulse");
        }, 800);
      });
    }
  });

  // Configuração da seleção dos cards de plano
  setupCardSelection(planCards);

  function setupCardSelection(planCards) {
    planCards.forEach(card => {
      card.addEventListener("click", function(e) {
        if (e.target.closest(".benefits-header") || e.target.closest(".benefits-toggle")) return;
        planCards.forEach(c => c.classList.remove("selected"));
        this.classList.add("selected");

        const planType = this.getAttribute("data-plan");
        document.getElementById("selectedPlan").value = planType;

        updatePlanSummary(this);
        document.getElementById("toStep3").disabled = false;
      });
    });
  }

  // Atualiza o resumo do plano com base no card selecionado
  function updatePlanSummary(selectedCard) {
    const planType = selectedCard.getAttribute("data-plan");
    const planTitle = selectedCard.querySelector(".plan-title").textContent;
    document.getElementById("summaryPlanName").textContent = planTitle;

    const summaryMatricula = document.getElementById("summaryMatricula");
    const summaryMensal = document.getElementById("summaryMensal");
    const summaryTotal = document.getElementById("summaryTotal");

    // Reseta a exibição dos campos do resumo
    summaryMatricula.style.display = "none";
    summaryMensal.style.display = "none";
    summaryTotal.style.display = "none";

    if (planType === "trimestral" || planType === "semestral" || planType === "anual") {
      // Planos com valor total único – não há seleção de dias
      const totalValue = selectedCard.getAttribute("data-total");
      document.getElementById("summaryTotalValue").textContent = `R$${totalValue}`;
      summaryTotal.style.display = "block";
      document.getElementById("summaryDays").textContent = "Todos os dias";
      document.getElementById("daysSelectionContainer").style.display = "none";
    } else if (planType === "individual") {
      // Para o plano individual, mostra sempre matrícula e mensalidade e configura a seleção de dias
      summaryMatricula.style.display = "block";
      summaryMensal.style.display = "block";
      setupDaysSelection(selectedCard, true);
    } else {
      // Para os demais planos, exibe os valores originais, se disponíveis, e a seleção de dias atualiza só o texto do resumo
      const matriculaValue = selectedCard.getAttribute("data-matricula");
      const mensalValue = selectedCard.getAttribute("data-mensal");
      if (matriculaValue) {
        document.getElementById("summaryMatriculaValue").textContent = `R$${matriculaValue}`;
        summaryMatricula.style.display = "block";
      }
      if (mensalValue) {
        document.getElementById("summaryMensalValue").textContent = `R$${mensalValue}`;
        summaryMensal.style.display = "block";
      }
      setupDaysSelection(selectedCard, false);
    }

    document.getElementById("priceSummary").style.display = "block";
  }

  // Configuração da seleção de dias
  // Se "isIndividual" for true, a mudança de dias atualiza matrícula e mensalidade conforme atributos específicos.
  function setupDaysSelection(selectedCard, isIndividual) {
    const daysContainer = document.getElementById("daysSelectionContainer");
    const daysOptions = document.getElementById("daysOptions");
    daysOptions.innerHTML = "";

    const option1 = document.createElement("div");
    option1.innerHTML = `
      <input type="radio" name="daysPerWeek" id="threeDays" value="3dias">
      <label for="threeDays">3 dias por semana</label>
    `;
    const option2 = document.createElement("div");
    option2.innerHTML = `
      <input type="radio" name="daysPerWeek" id="allDays" value="todososdias">
      <label for="allDays">Todos os dias</label>
    `;

    daysOptions.appendChild(option1);
    daysOptions.appendChild(option2);
    daysContainer.style.display = "block";

    const defaultRadio = daysOptions.querySelector('input[value="3dias"]');
    if (defaultRadio) {
      defaultRadio.checked = true;
      document.getElementById("summaryDays").textContent = "3 dias por semana";
      if (isIndividual) {
        document.getElementById("summaryMatriculaValue").textContent = `R$${selectedCard.getAttribute("data-matricula3")}`;
        document.getElementById("summaryMensalValue").textContent = `R$${selectedCard.getAttribute("data-mensal3")}`;
      }
    }

    const radioButtons = daysOptions.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
      radio.addEventListener("change", function() {
        if (this.value === "3dias") {
          document.getElementById("summaryDays").textContent = "3 dias por semana";
          if (isIndividual) {
            document.getElementById("summaryMatriculaValue").textContent = `R$${selectedCard.getAttribute("data-matricula3")}`;
            document.getElementById("summaryMensalValue").textContent = `R$${selectedCard.getAttribute("data-mensal3")}`;
          }
        } else {
          document.getElementById("summaryDays").textContent = "Todos os dias";
          if (isIndividual) {
            document.getElementById("summaryMatriculaValue").textContent = `R$${selectedCard.getAttribute("data-matricula7")}`;
            document.getElementById("summaryMensalValue").textContent = `R$${selectedCard.getAttribute("data-mensal7")}`;
          }
        }
      });
    });
  }

  // ----- OUTRAS FUNCIONALIDADES -----
  const validateCepBtn = document.getElementById("validateCep");
  validateCepBtn.addEventListener("click", function () {
    let cep = document.getElementById("zipcode").value;
    cep = cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      alert("CEP inválido. Por favor, insira um CEP válido de 8 dígitos.");
      return;
    }
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.erro) {
          alert("CEP não encontrado.");
        } else {
          document.getElementById("address").value = data.logradouro || "";
          document.getElementById("city").value = data.localidade || "";
          document.getElementById("state").value = data.uf || "";
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Erro ao buscar o CEP.");
      });
  });

  const otherHealthIssueRadio = document.getElementById("otherHealthIssue");
  const otherHealthContainer = document.getElementById("otherHealthContainer");
  const healthRadios = document.querySelectorAll("input[name='healthIssue']");
  const toStep5Button = document.getElementById("toStep5");
  healthRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      otherHealthContainer.style.display = otherHealthIssueRadio.checked ? "block" : "none";
      toStep5Button.disabled = false;
    });
  });

  const otherGoalRadio = document.getElementById("otherGoal");
  const otherGoalContainer = document.getElementById("otherGoalContainer");
  const goalRadios = document.querySelectorAll("input[name='trainingGoal']");
  const toStep6Button = document.getElementById("toStep6");
  goalRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      otherGoalContainer.style.display = otherGoalRadio.checked ? "block" : "none";
      toStep6Button.disabled = false;
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const unitSelect = document.getElementById("unit");
    const unit = unitSelect.options[unitSelect.selectedIndex].text;
    const plan = document.getElementById("summaryPlanName").textContent;
    const days = document.getElementById("summaryDays").textContent;

    let matriculaVal = "";
    let mensalVal = "";
    let totalVal = "";

    if (document.getElementById("summaryMatricula").style.display === "block") {
      matriculaVal = document.getElementById("summaryMatriculaValue").textContent;
    }
    if (document.getElementById("summaryMensal").style.display === "block") {
      mensalVal = document.getElementById("summaryMensalValue").textContent;
    }
    if (document.getElementById("summaryTotal").style.display === "block") {
      totalVal = document.getElementById("summaryTotalValue").textContent;
    }

    const nameVal = document.getElementById("name").value;
    const phoneVal = document.getElementById("phone").value;
    const emailVal = document.getElementById("email").value;
    const birthdateVal = document.getElementById("birthdate").value;
    const addressVal = document.getElementById("address").value;
    const cityVal = document.getElementById("city").value;
    const stateVal = document.getElementById("state").value;
    const zipcodeVal = document.getElementById("zipcode").value;

    let healthIssue = "";
    const healthRadio = document.querySelector("input[name='healthIssue']:checked");
    if (healthRadio) {
      healthIssue = healthRadio.value;
      if (healthRadio.value === "Outro") {
        const otherDesc = document.getElementById("otherHealthDescription").value;
        healthIssue += " - " + otherDesc;
      }
    }

    let trainingGoal = "";
    const goalRadio = document.querySelector("input[name='trainingGoal']:checked");
    if (goalRadio) {
      trainingGoal = goalRadio.value;
      if (goalRadio.value === "Outro") {
        const otherGoalDesc = document.getElementById("otherGoalDescription").value;
        trainingGoal += " - " + otherGoalDesc;
      }
    }

    let paymentMethod = "";
    const paymentRadio = document.querySelector("input[name='paymentMethod']:checked");
    if (paymentRadio) {
      paymentMethod = paymentRadio.value;
    }

    let message = "Nova solicitação de cadastro -Abdala Club academia\n";
    message += "Unidade: " + unit + "\n";
    message += "Plano: " + plan + "\n";

    if (matriculaVal && mensalVal) {
      message += "Matrícula: " + matriculaVal + "\n";
      message += "Mensalidade: " + mensalVal + "\n";
    }
    if (totalVal) {
      message += "Valor total: " + totalVal + "\n";
    }

    if (days && days !== "-") {
      message += "Dias de Treino: " + days + "\n";
    }

    message += "\nInformações Pessoais:\n";
    message += "Nome: " + nameVal + "\n";
    message += "Telefone: " + phoneVal + "\n";
    message += "E-mail: " + emailVal + "\n";
    message += "Data de Nascimento: " + birthdateVal + "\n";
    message += "Endereço: " + addressVal + ", " + cityVal + " - " + stateVal + " CEP: " + zipcodeVal + "\n\n";
    message += "Problemas de Saúde: " + healthIssue + "\n\n";
    message += "Objetivo de Treino: " + trainingGoal + "\n\n";
    message += "Forma de Pagamento: " + paymentMethod;

    const whatsappNumber = "5583993725984";
    const whatsappURL =
      "https://api.whatsapp.com/send?phone=" +
      whatsappNumber +
      "&text=" +
      encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
    form.reset();
  });
});
