#!/bin/bash

# Contenedores definidos en docker-compose.yml
CONTAINERS=("vue-frontend" "nest-backend")

show_main_menu() {
    echo "============================"
    echo "   SociAPP Control Script    "
    echo "============================"
    echo "Elige el contenedor:"
    for i in "${!CONTAINERS[@]}"; do
        echo "$((i+1))) ${CONTAINERS[$i]}"
    done
    echo "$(( ${#CONTAINERS[@]} + 1 ))) Ambos"
    echo "$(( ${#CONTAINERS[@]} + 2 ))) Exit"
    echo -n "Opción: "
}

show_action_menu() {
    echo ""
    echo "Acciones para $1:"
    echo "1) Build & Start"
    echo "2) Restart"
    echo "3) Stop"
    echo "4) Logs"
    echo "5) Volver al menú principal"
    echo -n "Elige una acción: "
}

while true; do
    show_main_menu
    read cont_option

    if [[ $cont_option -ge 1 && $cont_option -le ${#CONTAINERS[@]} ]]; then
        SELECTED_CONTAINERS=("${CONTAINERS[$((cont_option-1))]}")
    elif [[ $cont_option -eq $(( ${#CONTAINERS[@]} + 1 )) ]]; then
        SELECTED_CONTAINERS=("${CONTAINERS[@]}")  # Ambos
    elif [[ $cont_option -eq $(( ${#CONTAINERS[@]} + 2 )) ]]; then
        echo "Saliendo..."
        exit 0
    else
        echo "Opción inválida"
        continue
    fi

    while true; do
        if [[ ${#SELECTED_CONTAINERS[@]} -eq 1 ]]; then
            cname="${SELECTED_CONTAINERS[0]}"
        else
            cname="Ambos contenedores"
        fi
        show_action_menu "$cname"
        read action_option
        case $action_option in
            1)
                echo "Reconstruyendo y arrancando ${SELECTED_CONTAINERS[@]}..."
                for c in "${SELECTED_CONTAINERS[@]}"; do
                    docker-compose up -d --build
                done
                ;;
            2)
                echo "Reiniciando ${SELECTED_CONTAINERS[@]}..."
                for c in "${SELECTED_CONTAINERS[@]}"; do
                    docker restart $c
                done
                ;;
            3)
                echo "Deteniendo ${SELECTED_CONTAINERS[@]}..."
                for c in "${SELECTED_CONTAINERS[@]}"; do
                    docker stop $c
                done
                ;;
            4)
                if [[ ${#SELECTED_CONTAINERS[@]} -eq 1 ]]; then
                    echo "Mostrando logs de ${SELECTED_CONTAINERS[0]} (Ctrl+C para salir)..."
                    docker logs -f "${SELECTED_CONTAINERS[0]}"
                else
                    echo "No se pueden mostrar logs de ambos al mismo tiempo. Elige un contenedor individual."
                fi
                ;;
            5)
                break
                ;;
            *)
                echo "Opción inválida"
                ;;
        esac
        echo ""
    done
done
