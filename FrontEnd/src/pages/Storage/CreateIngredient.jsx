import React, { useEffect, useState } from "react";
import BackgroundCard from "../../components/BackgroundCard/BackgroundCard";
import InputWithLabel from "../../components/InputWithLabel/InputWithLabel";
import supabase from "../../utils/supabase";
import SelectInputWithLabel from "../../components/SelectInputWithLabel/SelectInputWithLabel";
import { validateAmountField, validateTextField } from "../../utils/functions";

const CreateIngredient = () => {
  const [ingredientName, setIngredientName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantityInStorage, setQuantityInStorage] = useState("");
  const [observation, setObservation] = useState("");
  const [ingredientBrand, setIngredientBrand] = useState("");
  const [unities, setUnities] = useState([]);
  const [selected, setSelected] = useState("");
  let hasErrorFlag = false;
  let errorIn = [];

  const resetFields = () => {
    setIngredientName("");
    setUnitPrice("");
    setQuantityInStorage("");
    setObservation("");
    setIngredientBrand("");
    setSelected("");
  };

  const handleInsert = async (ev) => {
    ev.preventDefault();
    validateInputFields();

    try {
      if (!hasErrorFlag) {
        // Inserir na tabela Item
        const { data: itemData, error: itemError } = await supabase
          .from("Item")
          .insert([
            {
              nome: ingredientName,
              valor_unitario: unitPrice,
              qtd_estoque: quantityInStorage,
              observacao: observation,
              data_criacao: new Date(),
            },
          ])
          .select();

        if (itemError) {
          console.log("Erro ao inserir dados na tabela Item:", itemError);
          return;
        }

        // Recuperar o cod_item da linha inserida
        const cod_item = itemData[0].cod_item;

        // Inserir na tabela Ingrediente usando o cod_item
        const { data: ingredientData, error: ingredientError } = await supabase
          .from("Ingrediente")
          .insert([
            {
              marca: ingredientBrand,
              cod_item: cod_item,
              cod_unidade_medida: selected,
            },
          ]);

        if (ingredientError) {
          console.log("Erro ao inserir dados na tabela Ingrediente:", ingredientError);
        } else {
          console.log("Ingrediente inserido:", ingredientData);
          alert("Ingrediente adicionado!");
          resetFields();
        }
      } else {
        throw new Error("Campos preenchidos incorretamente! Tente novamente.");
      }
    } catch (err) {
      alert("Erro no conteúdo de entrada!", err);
      console.log("Erro ao inserir dados:", err);
    }
  };

  const validateInputFields = () => {
    if (!validateTextField(ingredientName)) {
      errorIn.push("IngredientName");
    } else if (!validateAmountField(unitPrice)) {
      errorIn.push("UnitPrice");
    } else if (quantityInStorage === "") {
      errorIn.push("QuantiyInStorage");
    } else if (!validateTextField(ingredientBrand)) {
      errorIn.push("IngredientBrand");
    } else if (!selected) {
      errorIn.push("SelectedInput");
    }

    if (errorIn.length > 0) {
      hasErrorFlag = true;
      console.log(errorIn);
      return false;
    }
    return true;
  };

  // Carregar "Unidade_de_Medida" do banco de dados
  useEffect(() => {
    async function fetchUnities() {
      try {
        let { data: Unidade_Medida, error } = await supabase
          .from("Unidade_Medida")
          .select("*");

        if (error) {
          console.log("Erro ao buscar unidades de medida:", error);
        } else {
          setUnities(Unidade_Medida);
        }
      } catch (error) {
        console.log("Erro:", error);
      }
    }

    fetchUnities();
  }, []);

  return (
    <div>
      <BackgroundCard title={"Adicionar novo ingrediente:"}>
        <p className="text-sm">
          Preencha o formulário abaixo para cadastro de um novo ingrediente no seu estoque.
        </p>
        <form onSubmit={handleInsert}>
          <InputWithLabel
            label="Nome do produto"
            inputType="text"
            inputValue={ingredientName}
            onChangeFunction={(ev) => setIngredientName(ev.target.value)}
          />
          <InputWithLabel
            label="Preço unitário"
            inputType="number"
            inputValue={unitPrice}
            placeholder="R$ 0.00"
            onChangeFunction={(ev) => setUnitPrice(ev.target.value)}
          />
          <InputWithLabel
            label="Em estoque"
            inputType="number"
            inputValue={quantityInStorage}
            placeholder="0"
            onChangeFunction={(ev) => setQuantityInStorage(ev.target.value)}
          />
          <InputWithLabel
            label="Observação"
            inputType="text"
            inputValue={observation}
            onChangeFunction={(ev) => setObservation(ev.target.value)}
          />
          <InputWithLabel
            label="Marca"
            inputType="text"
            inputValue={ingredientBrand}
            onChangeFunction={(ev) => setIngredientBrand(ev.target.value)}
          />
          <SelectInputWithLabel
            options={unities}
            handleChange={(ev) => setSelected(ev.target.value)}
            label={"Unidade de medida"}
          />

          <button
            type="submit"
            className="mt-5 bg-contrastColor text-white font-bold text-center p-1 rounded-lg w-full text-sm hover:bg-contrastColorHover hover:cursor-pointer"
          >
            Adicionar
          </button>
        </form>
      </BackgroundCard>
    </div>
  );
};

export default CreateIngredient;
