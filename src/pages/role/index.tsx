import RoleList from "@/components/role-list";
import { Role } from "@/model/Role";
import { authService } from "@/services/auth.service";
import { roleservice } from "@/services/role.service";
import router, { useRouter } from "next/router";
import React, { useEffect } from "react";
import styles from "./styles.module.css";
import Head from "next/head";

export default function GetRoles() {
  const router = useRouter();

  const [roles, setRoles] = React.useState<Role[]>([]);

  useEffect(fetchRoles, []);

  function treat(error: any) {
    if (authService.isUnauthorized(error)) {
      router.replace("login");
    } else {
      alert(error.message);
    }
  }

  function fetchRoles() {
    roleservice
      .GetList()
      .then((list) => setRoles(list))
      .catch(treat);
  }

  function goToRole() {
    alert("Indo para página de add");
  }

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <main>
        <div className={styles.homeHeader}>
          <div>
            <button onClick={() => router.replace("home")}>Voltar</button>
          </div>

          <h3>Listagem de Pefils</h3>

          <div>
            <button onClick={goToRole}>Add</button>
          </div>
        </div>

        <div className={styles.homeMain}>
          <RoleList roles={roles} />
        </div>
      </main>
    </>
  );
}
