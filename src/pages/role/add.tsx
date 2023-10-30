import { useState } from "react";
import MyInput from "../../components/input";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { authService } from "@/services/auth.service";
import { roleservice } from "@/services/role.service";

export default function AddRole() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function treat(error: any) {
    if (authService.isUnauthorized(error)) {
      router.replace("/login");
    } else {
      alert(`${name}: ${error.message}`);
    }
  }

  function save() {
    try {
      if (!name || name.trim() === "") {
        alert("Preencha o nome do perfil");
        return;
      }

      roleservice.create({ name, description });
      router.back()
    } catch (error: any) {
      treat(error);
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.box}>
          <MyInput
            label="Nome"
            onChange={(event) => setName(event.target.value)}
          />

          <MyInput
            label="Descrição"
            onChange={(event) => setDescription(event.target.value)}
          />

          <button
            className={styles.backButton}
            onClick={() => router.push("/role")}
          >
            Voltar
          </button>
          <button className={styles.button} onClick={save}>
            Salvar
          </button>
        </div>
      </div>
    </>
  );
}
